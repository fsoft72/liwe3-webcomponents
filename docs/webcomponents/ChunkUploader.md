# ChunkUploader

A file uploader component with drag & drop support, file previews, and reliable chunked uploads for large files.

## Basic Usage

```html
<liwe3-chunk-uploader id="myUploader"></liwe3-chunk-uploader>

<script type="module">
  import '@liwe3/webcomponents';

  const uploader = document.getElementById('myUploader');

  // Configure server URL
  uploader.serverURL = 'https://api.example.com';
  
  // Optional: Set auth token
  uploader.authToken = 'your-auth-token';
</script>
```

## TypeScript Usage

```typescript
import { ChunkUploaderElement, ChunkUploaderConfig, UploadedFile } from '@liwe3/webcomponents';

const uploader = document.getElementById('myUploader') as ChunkUploaderElement;

// Configure the uploader
uploader.serverURL = 'https://api.example.com';
uploader.chunkSize = 10; // 10MB chunks
uploader.validFiletypes = ['jpg', 'png', 'pdf', 'mp4'];
uploader.maxFileSize = 1024; // 1GB
uploader.folder = 'user-uploads';

// Listen for completion
uploader.addEventListener('uploadcomplete', (e: CustomEvent<UploadedFile[]>) => {
  console.log('All files uploaded:', e.detail);
});
```

## Features

### Chunked Uploads

Large files are automatically split into smaller chunks (default 5MB) and uploaded sequentially. This ensures reliable uploads even on unstable connections and bypasses server-side file size limits.

### Drag & Drop Interface

Users can drag and drop files onto the upload zone or use the file browser. The interface provides visual feedback during drag operations.

### File Previews

Image files automatically generate and display thumbnail previews before upload.

### Progress Tracking

Real-time progress bars show upload status for each file, with color-coded indicators for success (green), error (red), and aborted (orange) states.

### Abort Support

Users can abort ongoing uploads at any time. The component handles cleaning up partial uploads on the server if the API supports it.

## Configuration

### Server URL

The base URL for your upload server API.

```typescript
uploader.serverURL = 'https://api.myserver.com';
// Attribute: server-url="https://api.myserver.com"
```

**Source:** `ChunkUploader.ts:91-98`

### Chunk Size

Size of each upload chunk in megabytes.

```typescript
uploader.chunkSize = 10; // 10 MB
// Attribute: chunk-size="10"
```

**Default:** 5 MB

**Source:** `ChunkUploader.ts:100-107`

### Auth Token

Bearer token to be sent in the `Authorization` header.

```typescript
uploader.authToken = 'eyJhbG...';
// Attribute: auth-token="eyJhbG..."
```

**Source:** `ChunkUploader.ts:109-121`

### Valid File Types

Array of allowed file extensions (without dots).

```typescript
uploader.validFiletypes = ['jpg', 'png', 'pdf'];
// Attribute: valid-filetypes="jpg,png,pdf"
```

**Source:** `ChunkUploader.ts:123-134`

### Max File Size

Maximum allowed file size in megabytes.

```typescript
uploader.maxFileSize = 100; // 100 MB
// Attribute: max-file-size="100"
```

**Default:** 5120 MB (5 GB)

**Source:** `ChunkUploader.ts:136-144`

### Labels

Customize the text displayed in the UI.

```typescript
uploader.labelDropFiles = 'Drag your files here';
uploader.labelBrowse = 'Select Files';
// Attributes: label-drop-files="...", label-browse="..."
```

**Source:** `ChunkUploader.ts:145-171`

### Destination Folder

Optional folder path/name to organize uploads on the server.

```typescript
uploader.folder = 'project-123';
// Attribute: folder="project-123"
```

**Source:** `ChunkUploader.ts:173-184`

### Response Parsing

Custom function to transform server responses if your API structure differs from the default expectation.

```typescript
uploader.parseResponse = (response, endpoint) => {
  // endpoint is 'initiate', 'part', or 'complete'
  if (endpoint === 'initiate') {
    return {
      uploadId: response.data.id,
      key: response.data.key
    };
  }
  return response;
};
```

**Source:** `ChunkUploader.ts:194-196`

## Events

### `filecomplete`

Fired when a single file finishes uploading.

**Detail:** `UploadedFile` object

```typescript
uploader.addEventListener('filecomplete', (e) => {
  const file = e.detail;
  console.log(`File ${file.file.name} uploaded successfully`);
});
```

**Source:** `ChunkUploader.ts:432-438`

### `uploadcomplete`

Fired when all files in the queue have finished uploading.

**Detail:** `UploadedFile[]` (Array of all files)

```typescript
uploader.addEventListener('uploadcomplete', (e) => {
  console.log('Batch upload finished', e.detail);
});
```

**Source:** `ChunkUploader.ts:493-499`

### `uploadaborted`

Fired when the user cancels the upload process.

**Detail:** `UploadedFile[]` (Array of aborted files)

```typescript
uploader.addEventListener('uploadaborted', (e) => {
  console.log('Upload cancelled', e.detail);
});
```

**Source:** `ChunkUploader.ts:569-575`

## Server API Requirements

The component expects a backend API supporting the S3/R2 multipart upload flow with the following endpoints:

### 1. Initiate Upload
**POST** `/api/upload/initiate`
- **Body:** `{ fileName, fileType, folder }`
- **Response:** `{ uploadId, key }`

### 2. Upload Part
**POST** `/api/upload/part`
- **Headers:** 
  - `X-Upload-Id`: uploadId from initiate
  - `X-Key`: key from initiate
  - `X-Part-Number`: Sequential number (1-based)
- **Body:** Binary file chunk
- **Response:** `{ etag }`

### 3. Complete Upload
**POST** `/api/upload/complete`
- **Body:** `{ uploadId, key, parts: [{ partNumber, etag }, ...] }`
- **Response:** Any success response

### 4. Abort Upload (Optional)
**POST** `/api/upload/abort`
- **Body:** `{ uploadId, key }`

## CSS Customization

The component uses Shadow DOM but exposes some styling through CSS variables and standard layout properties.

```css
liwe3-chunk-uploader {
  display: block;
  width: 100%;
  --color-primary: #4CAF50; /* Progress bar color */
}
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chunk Uploader Example</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    liwe3-chunk-uploader {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>File Uploader</h1>
  
  <liwe3-chunk-uploader 
    id="uploader"
    server-url="http://localhost:3000"
    chunk-size="5"
    valid-filetypes="jpg,png,pdf,zip"
    label-drop-files="Drop your documents here"
  ></liwe3-chunk-uploader>

  <div id="log"></div>

  <script type="module">
    import '@liwe3/webcomponents';

    const uploader = document.getElementById('uploader');
    const log = document.getElementById('log');

    // Add auth token if needed
    uploader.authToken = 'my-secret-token';

    uploader.addEventListener('filecomplete', (e) => {
      const p = document.createElement('p');
      p.textContent = `✅ ${e.detail.file.name} uploaded!`;
      log.appendChild(p);
    });

    uploader.addEventListener('uploadcomplete', (e) => {
      const p = document.createElement('p');
      p.textContent = `🎉 All ${e.detail.length} files processed.`;
      p.style.fontWeight = 'bold';
      log.appendChild(p);
    });

    uploader.addEventListener('uploadaborted', () => {
      const p = document.createElement('p');
      p.textContent = '⚠️ Upload cancelled by user.';
      p.style.color = 'orange';
      log.appendChild(p);
    });
  </script>
</body>
</html>
```

## Related Components

- [AITextEditor](./AITextEditor.md)
- [SmartSelect](./SmartSelect.md)
