/**
 * Cloudflare Worker for R2 Multipart Upload
 *
 * Endpoints:
 *   POST /api/upload/initiate       → Start multipart upload
 *                                      Body: {fileName: string, fileType: string}
 *                                      Returns: {uploadId: string, key: string}
 *
 *   POST /api/upload/part           → Upload individual part (raw binary data)
 *                                      Headers: X-Upload-Id, X-Key, X-Part-Number
 *                                      Body: Raw binary data (ArrayBuffer)
 *                                      Returns: {partNumber: number, etag: string}
 *
 *   POST /api/upload/complete       → Complete multipart upload
 *                                      Body: {uploadId: string, key: string, parts: [{partNumber, etag}]}
 *                                      Returns: {success: true, key: string, size: number, etag: string}
 *
 *   POST /api/upload/abort          → Abort multipart upload and cleanup parts
 *                                      Body: {uploadId: string, key: string}
 *                                      Returns: {success: true}
 *
 *   GET  /api/upload/list           → List uploaded files
 *                                      Returns: {objects: [{key, size, uploaded}], count: number, truncated: boolean}
 *
 * Requires R2 bucket binding named "MY_BUCKET"
 *
 * Part Cleanup:
 *   - On successful complete(): R2 automatically deletes all parts and creates final object
 *   - On abort(): Explicitly deletes all parts via multipartUpload.abort()
 *   - For abandoned uploads: Configure R2 lifecycle rules to auto-cleanup incomplete uploads
 *
 * Recommended R2 Lifecycle Rule (via Cloudflare Dashboard):
 *   - Rule: Delete incomplete multipart uploads after 7 days
 *   - This prevents storage waste from failed/abandoned uploads
 */

export default {
  async fetch(request, env) {
    try {
      // CORS preflight support
      if (request.method === "OPTIONS") {
        return handleCORS();
      }

      const url = new URL(request.url);
      if (url.pathname === "/api/upload/initiate" && request.method === "POST") {
        return await handleInitiate(request, env);
      }
      if (url.pathname === "/api/upload/part" && request.method === "POST") {
        return await handleUploadPart(request, env);
      }
      if (url.pathname === "/api/upload/complete" && request.method === "POST") {
        return await handleComplete(request, env);
      }
      if (url.pathname === "/api/upload/abort" && request.method === "POST") {
        return await handleAbort(request, env);
      }
      if (url.pathname === "/api/upload/list" && request.method === "GET") {
        return await handleList(request, env);
      }
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      // Silently handle aborted requests (client closed connection)
      if (error.message && error.message.includes('Network connection lost')) {
        return jsonResponse({ error: "Request aborted by client" }, 499);
      }
      // Re-throw other errors to be logged
      throw error;
    }
  },
};

async function handleInitiate(request, env) {
  const { fileName, fileType } = await request.json();

  if (!fileName) {
    return jsonResponse({ error: "fileName is required" }, 400);
  }

  // Use a time-based key so uploads are unique, or customize as needed
  const timestamp = Date.now();
  const key = `uploads/${timestamp}-${fileName}`;

  const multipartUpload = await env.MY_BUCKET.createMultipartUpload(key, {
    httpMetadata: {
      contentType: fileType || "application/octet-stream",
    },
  });

  return jsonResponse({
    uploadId: multipartUpload.uploadId,
    key: multipartUpload.key,
  });
}

async function handleUploadPart(request, env) {
  // Read metadata from headers
  const uploadId = request.headers.get('X-Upload-Id');
  const key = request.headers.get('X-Key');
  const partNumber = parseInt(request.headers.get('X-Part-Number'), 10);

  if (!uploadId || !key || !partNumber) {
    return jsonResponse({ error: "Missing required headers: X-Upload-Id, X-Key, X-Part-Number" }, 400);
  }

  // Read raw binary data from request body
  // This can throw "Network connection lost" if the client aborted the request
  // That error is caught and handled silently at the top level
  const binaryData = await request.arrayBuffer();

  if (!binaryData || binaryData.byteLength === 0) {
    return jsonResponse({ error: "Empty request body" }, 400);
  }

  const multipartUpload = env.MY_BUCKET.resumeMultipartUpload(key, uploadId);
  const uploadedPart = await multipartUpload.uploadPart(partNumber, binaryData);

  return jsonResponse({
    partNumber: uploadedPart.partNumber,
    etag: uploadedPart.etag,
  });
}

async function handleComplete(request, env) {
  const { uploadId, key, parts } = await request.json();
  if (!uploadId || !key || !Array.isArray(parts)) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  console.log(`Completing multipart upload: ${key}, ${parts.length} parts`);

  const multipartUpload = env.MY_BUCKET.resumeMultipartUpload(key, uploadId);

  // Complete the upload - R2 will automatically delete all uploaded parts
  // and assemble them into the final object
  const object = await multipartUpload.complete(parts);

  console.log(`Upload completed successfully: ${object.key}, size: ${object.size} bytes`);

  return jsonResponse({
    success: true,
    key: object.key,
    size: object.size,
    etag: object.etag,
  });
}

async function handleAbort(request, env) {
  const { uploadId, key } = await request.json();
  if (!uploadId || !key) {
    return jsonResponse({ error: "Missing required fields: uploadId, key" }, 400);
  }

  const multipartUpload = env.MY_BUCKET.resumeMultipartUpload(key, uploadId);

  // Abort the upload - this will delete all uploaded parts and free up storage
  await multipartUpload.abort();

  return jsonResponse({
    success: true,
    message: "Upload aborted and parts cleaned up",
  });
}

function handleCORS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Upload-Id, X-Key, X-Part-Number, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

async function handleList(request, env) {
  const listed = await env.MY_BUCKET.list({ prefix: 'uploads/' });

  const objects = listed.objects.map(obj => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded
  }));

  return jsonResponse({
    objects,
    count: objects.length,
    truncated: listed.truncated
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Upload-Id, X-Key, X-Part-Number, Authorization",
    },
  });
}
