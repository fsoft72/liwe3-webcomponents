<script lang="ts">
  import { ChunkUploader } from "@liwe3/webcomponents-svelte";
  import type { UploadedFile } from "@liwe3/webcomponents";

  interface UploadLogEntry {
    message: string;
    timestamp: string;
  }

  let serverUrl = $state<string>("http://127.0.0.1:8787");
  let chunkSize = $state<string>("5");
  let maxFileSize = $state<string>("5120");
  let authToken = $state<string>("");
  let allowedExtensionsInput = $state<string>("jpg,png,pdf,mp4,zip");
  let recentFiles = $state<UploadedFile[]>([]);
  let uploadLog = $state<UploadLogEntry[]>([]);

  const allowedExtensions = $derived.by<string[] | undefined>(() => {
    const parsed = allowedExtensionsInput
      .split(",")
      .map((ext) => ext.trim().toLowerCase())
      .filter(Boolean);
    return parsed.length ? parsed : undefined;
  });

  const normalizedChunkSize = $derived.by<number>(() =>
    Math.max(1, Number(chunkSize) || 1)
  );

  const normalizedMaxFileSize = $derived.by<number>(() =>
    Math.max(1, Number(maxFileSize) || 1)
  );

  /**
   * Returns a short string representing the amount of bytes.
   */
  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(
      units.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024))
    );
    const value = bytes / 1024 ** index;
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const pushLogEntry = (message: string) => {
    uploadLog = [
      { message, timestamp: new Date().toLocaleTimeString() },
      ...uploadLog,
    ].slice(0, 8);
  };

  const handleFileComplete = (event: CustomEvent<UploadedFile>) => {
    const file = event.detail;
    recentFiles = [
      file,
      ...recentFiles.filter((item) => item.id !== file.id),
    ].slice(0, 5);
    pushLogEntry(`✅ ${file.file.name} finished uploading`);
  };

  const handleUploadComplete = (event: CustomEvent<UploadedFile[]>) => {
    const files = event.detail;
    recentFiles = files.slice(-5).reverse();
    pushLogEntry(
      `🎉 Uploaded ${files.length} file${files.length === 1 ? "" : "s"}`
    );
  };

  const handleUploadAborted = (event: CustomEvent<UploadedFile[]>) => {
    const files = event.detail;
    pushLogEntry(
      `⚠️ Aborted ${files.length} file${files.length === 1 ? "" : "s"}`
    );
  };
</script>

<div class="page-container">
  <header class="page-header">
    <div>
      <h1>ChunkUploader Demo</h1>
      <p class="subtitle">
        Upload multi-gigabyte files through the Cloudflare Worker in <code
          >servers/upload-demo</code
        >.
      </p>
    </div>
  </header>

  <section class="callout">
    <h2>Worker Setup</h2>
    <p>The uploader talks to the Worker bundled with this repo.</p>
    <ol>
      <li>Open <code>servers/upload-demo</code> in a terminal.</li>
      <li>
        Run <code>pnpm install</code> (first time) and
        <code>pnpm run dev</code>.
      </li>
      <li>
        Keep wrangler running on <code>http://127.0.0.1:8787</code> or update the
        URL below.
      </li>
    </ol>
  </section>

  <section class="controls">
    <h2>Uploader Settings</h2>
    <div class="controls-grid">
      <label>
        <span>Worker URL</span>
        <input
          type="text"
          bind:value={serverUrl}
          placeholder="http://127.0.0.1:8787"
        />
      </label>
      <label>
        <span>Chunk Size (MB)</span>
        <input type="number" min="1" step="1" bind:value={chunkSize} />
      </label>
      <label>
        <span>Max File Size (MB)</span>
        <input type="number" min="1" step="1" bind:value={maxFileSize} />
      </label>
      <label>
        <span>Allowed Extensions</span>
        <input
          type="text"
          bind:value={allowedExtensionsInput}
          placeholder="jpg,png,pdf"
        />
      </label>
      <label>
        <span>Auth Token (optional)</span>
        <input type="text" bind:value={authToken} placeholder="Bearer token" />
      </label>
    </div>
    <p class="controls-hint">
      The Worker exposes <code>/api/upload/initiate</code>, <code>part</code>,
      <code>complete</code>, and
      <code>abort</code> endpoints. The UI below calls them automatically.
    </p>
  </section>

  <section class="uploader-wrapper">
    <ChunkUploader
      serverURL={serverUrl}
      chunkSize={normalizedChunkSize}
      maxFileSize={normalizedMaxFileSize}
      authToken={authToken || undefined}
      validFiletypes={allowedExtensions}
      onfilecomplete={handleFileComplete}
      onuploadcomplete={handleUploadComplete}
      onuploadaborted={handleUploadAborted}
      class="uploader"
    />
  </section>

  <section class="status-grid">
    <div class="status-card">
      <h3>Recent Files</h3>
      {#if recentFiles.length === 0}
        <p class="muted">Upload a file to see its progress.</p>
      {:else}
        <ul>
          {#each recentFiles as file}
            <li>
              <div>
                <strong>{file.file.name}</strong>
                <span class="muted">{formatBytes(file.file.size)}</span>
              </div>
              <div class={`status-chip status-${file.status}`}>
                {file.status}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <div class="status-card">
      <h3>Upload Log</h3>
      {#if uploadLog.length === 0}
        <p class="muted">No activity yet.</p>
      {:else}
        <ul class="log">
          {#each uploadLog as entry}
            <li>
              <span class="log-time">{entry.timestamp}</span>
              <span>{entry.message}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>
</div>

<style>
  .page-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
    color: #1a1a1a;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    color: #555;
  }

  .callout {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .callout h2 {
    margin-top: 0;
  }

  .callout ol {
    margin: 0.5rem 0 0 1.25rem;
    padding: 0;
  }

  .controls {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background: #fff;
  }

  .controls-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    color: #374151;
    gap: 0.35rem;
  }

  input[type="text"],
  input[type="number"] {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.65rem 0.75rem;
    font-size: 1rem;
  }

  input:focus {
    outline: 2px solid #0ea5e9;
    outline-offset: 1px;
  }

  .controls-hint {
    margin: 0;
    color: #6b7280;
    font-size: 0.95rem;
  }

  .uploader-wrapper {
    border: 1px dashed #d4d4d8;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2.5rem;
    background: #fafafa;
  }

  .uploader {
    display: block;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .status-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem;
    background: #fff;
  }

  .status-card ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .status-card li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
    gap: 1rem;
  }

  .status-card li:last-child {
    border-bottom: none;
  }

  .muted {
    color: #6b7280;
    margin: 0;
  }

  .status-chip {
    text-transform: capitalize;
    font-size: 0.85rem;
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
    font-weight: 600;
  }

  .status-completed {
    background: #dcfce7;
    color: #15803d;
  }

  .status-uploading {
    background: #e0f2fe;
    color: #0369a1;
  }

  .status-error,
  .status-aborted {
    background: #fee2e2;
    color: #b91c1c;
  }

  .log {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .log li {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 0.5rem;
  }

  .log li:last-child {
    border-bottom: none;
  }

  .log-time {
    font-size: 0.8rem;
    color: #9ca3af;
  }

  @media (max-width: 640px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .uploader-wrapper {
      padding: 1.25rem;
    }
  }
</style>
