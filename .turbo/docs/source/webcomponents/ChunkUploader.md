# ChunkUploader Component

A file uploader component that supports chunked uploads for large files.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <liwe3-chunk-uploader 
    id="demo-uploader"
    url="https://httpbin.org/post"
    chunk-size="1024"
  ></liwe3-chunk-uploader>
  <div id="upload-log" style="margin-top: 10px; font-family: monospace; font-size: 12px; max-height: 100px; overflow: auto; background: #f5f5f5; padding: 5px;"></div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const uploader = document.getElementById('demo-uploader');
    const log = document.getElementById('upload-log');
    
    function logMsg(msg) {
      const div = document.createElement('div');
      div.textContent = new Date().toLocaleTimeString() + ': ' + msg;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    if (uploader) {
      uploader.addEventListener('upload-start', () => logMsg('Upload started'));
      uploader.addEventListener('upload-progress', (e) => logMsg('Progress: ' + e.detail.percent + '%'));
      uploader.addEventListener('upload-complete', () => logMsg('Upload complete'));
      uploader.addEventListener('upload-error', (e) => logMsg('Error: ' + e.detail.message));
    }
  });
</script>

## Attributes & Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| \`server-url\` | \`serverURL\` | \`string\` | \`""\` | The base URL of the upload server. |
| \`chunk-size\` | \`chunkSize\` | \`number\` | \`5\` | Size of each chunk in MB. |
| \`auth-token\` | \`authToken\` | \`string\` | \`undefined\` | Bearer token for authorization headers. |
| \`valid-filetypes\` | \`validFiletypes\` | \`string[]\` | \`undefined\` | Array of allowed file extensions (e.g., \`['jpg', 'png']\`). |
| \`max-file-size\` | \`maxFileSize\` | \`number\` | \`5120\` | Maximum allowed file size in MB (default 5GB). |
| \`label-drop-files\` | \`labelDropFiles\` | \`string\` | \`"Drop files here"\` | Custom text for the drop zone. |
| \`label-browse\` | \`labelBrowse\` | \`string\` | \`"Browse Files"\` | Custom label for the browse button. |
| \`folder\` | \`folder\` | \`string\` | \`undefined\` | Destination folder name for uploads. |

## Methods

The component exposes properties for callbacks that can be set programmatically:

| Property | Type | Description |
|----------|------|-------------|
| \`onfilecomplete\` | \`(file: UploadedFile) => void\` | Callback function when a single file upload completes. |
| \`onuploadcomplete\` | \`(files: UploadedFile[]) => void\` | Callback function when all files are uploaded. |
| \`parseResponse\` | \`(response: any, endpoint: string) => any\` | Function to transform API responses if they don't match expected format. |

### UploadedFile Interface

\`\`\`typescript
interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'aborted';
  progress: number;
  uploadedBytes: number;
  preview?: string;
  error?: string;
  uploadId?: string;
  key?: string;
}
\`\`\`

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`filecomplete\` | \`UploadedFile\` | Fired when a single file upload completes. |
| \`uploadcomplete\` | \`UploadedFile[]\` | Fired when all queued files have finished uploading. |
| \`uploadaborted\` | \`UploadedFile[]\` | Fired when uploads are aborted by the user. |

## API Endpoints

The component expects the following endpoints on the server:

1.  **POST** \`/api/upload/initiate\`
    *   Body: \`{ fileName, fileType, folder }\`
    *   Response: \`{ uploadId, key }\`
2.  **POST** \`/api/upload/part\`
    *   Headers: \`X-Upload-Id\`, \`X-Key\`, \`X-Part-Number\`
    *   Body: Binary chunk data
    *   Response: \`{ etag }\`
3.  **POST** \`/api/upload/complete\`
    *   Body: \`{ uploadId, key, parts: [{ partNumber, etag }] }\`
    *   Response: Any (success)
4.  **POST** \`/api/upload/abort\` (Optional)
    *   Body: \`{ uploadId, key }\`

## Styling

The component uses Shadow DOM but exposes CSS variables for customization:

\`\`\`css
liwe3-chunk-uploader {
  --color-primary: #4CAF50; /* Progress bar and button color */
}
\`\`\`
