# R2 Upload Demo Worker

Cloudflare Worker for handling chunked file uploads to R2 using multipart upload protocol.

## Overview

This worker provides endpoints for the ChunkUploader web component to upload large files (up to 5GB) to Cloudflare R2 using the multipart upload API.

## Endpoints

- `POST /initiate` - Start a multipart upload
- `POST /upload-part` - Upload a file chunk (raw binary)
- `POST /complete` - Complete the multipart upload
- `POST /abort` - Abort upload and cleanup parts
- `GET /list` - List uploaded files (for testing)

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure your R2 bucket in `wrangler.jsonc`:
   ```jsonc
   {
     "r2_buckets": [
       {
         "binding": "MY_BUCKET",
         "bucket_name": "your-bucket-name"
       }
     ]
   }
   ```

3. Run locally:
   ```bash
   pnpm run dev
   ```

4. Deploy to production:
   ```bash
   pnpm run deploy
   ```

## Scripts

- `pnpm run dev` - Start local development server
- `pnpm run deploy` - Deploy to Cloudflare
- `pnpm run tail` - View production logs
- `pnpm run clean:blobs` - Remove local blob artifacts from `.wrangler/state/v3/r2/*/blobs/`
- `pnpm run clean:all` - Remove entire `.wrangler` directory

## Local Development Notes

When running locally with `wrangler dev`, you may see blob files accumulate in `.wrangler/state/v3/r2/*/blobs/`. These are **internal artifacts** of miniflare's R2 simulation and don't affect functionality.

- In **production R2**: Parts are automatically deleted after `multipartUpload.complete()`
- In **local dev**: Blob files may remain but are not visible via R2 API

Run `pnpm run clean:blobs` periodically to clean up these artifacts during development.

## R2 Lifecycle Rules (Recommended)

To automatically clean up abandoned uploads in production:

1. Go to Cloudflare Dashboard → R2 → Your Bucket → Settings
2. Add Lifecycle Rule:
   - **Type**: Delete incomplete multipart uploads
   - **Days after initiation**: 7
   - **Action**: Delete

This prevents storage waste from uploads that were started but never completed (e.g., due to browser crashes or network issues).

## Protocol

### Initiate Upload
```http
POST /initiate
Content-Type: application/json

{
  "fileName": "example.mp4",
  "fileType": "video/mp4"
}

Response:
{
  "uploadId": "...",
  "key": "uploads/1234567890-example.mp4"
}
```

### Upload Part
```http
POST /upload-part
Content-Type: application/octet-stream
X-Upload-Id: <uploadId>
X-Key: <key>
X-Part-Number: 1

<binary data>

Response:
{
  "partNumber": 1,
  "etag": "..."
}
```

### Complete Upload
```http
POST /complete
Content-Type: application/json

{
  "uploadId": "...",
  "key": "uploads/1234567890-example.mp4",
  "parts": [
    {"partNumber": 1, "etag": "..."},
    {"partNumber": 2, "etag": "..."}
  ]
}

Response:
{
  "success": true,
  "key": "uploads/1234567890-example.mp4",
  "size": 1234567,
  "etag": "..."
}
```

### Abort Upload
```http
POST /abort
Content-Type: application/json

{
  "uploadId": "...",
  "key": "uploads/1234567890-example.mp4"
}

Response:
{
  "success": true,
  "message": "Upload aborted and parts cleaned up"
}
```

## CORS

The worker includes CORS headers allowing requests from any origin. For production, update the CORS configuration to restrict allowed origins.

## License

MIT
