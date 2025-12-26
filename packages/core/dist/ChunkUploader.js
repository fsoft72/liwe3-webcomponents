class k extends HTMLElement {
  constructor() {
    super(), this.files = /* @__PURE__ */ new Map(), this.config = {
      serverURL: "",
      chunkSize: 5,
      maxFileSize: 5120
    }, this.isUploading = !1, this.abortController = null, this.attachShadow({ mode: "open" }), this.render(), this.bindEvents();
  }
  static get observedAttributes() {
    return ["server-url", "chunk-size", "auth-token", "valid-filetypes", "max-file-size", "label-drop-files", "label-browse", "folder", "compact"];
  }
  attributeChangedCallback(e, i, o) {
    if (i !== o)
      switch (e) {
        case "server-url":
          this.config.serverURL = o || "";
          break;
        case "chunk-size":
          this.config.chunkSize = parseFloat(o || String(5));
          break;
        case "auth-token":
          this.config.authToken = o || void 0;
          break;
        case "valid-filetypes":
          this.config.validFiletypes = o ? o.split(",").map((t) => t.trim()) : void 0;
          break;
        case "max-file-size":
          this.config.maxFileSize = parseFloat(o || String(5120));
          break;
        case "label-drop-files":
          this.config.labelDropFiles = o || void 0, this.updateLabels();
          break;
        case "label-browse":
          this.config.labelBrowse = o || void 0, this.updateLabels();
          break;
        case "folder":
          this.config.folder = o || void 0;
          break;
        case "compact":
          this.config.compact = o !== null, this.updateCompactMode();
          break;
      }
  }
  // Property getters and setters
  get serverURL() {
    return this.config.serverURL;
  }
  set serverURL(e) {
    this.config.serverURL = e, this.setAttribute("server-url", e);
  }
  get chunkSize() {
    return this.config.chunkSize;
  }
  set chunkSize(e) {
    this.config.chunkSize = e, this.setAttribute("chunk-size", e.toString());
  }
  get authToken() {
    return this.config.authToken;
  }
  set authToken(e) {
    e ? (this.config.authToken = e, this.setAttribute("auth-token", e)) : (this.config.authToken = void 0, this.removeAttribute("auth-token"));
  }
  get validFiletypes() {
    return this.config.validFiletypes;
  }
  set validFiletypes(e) {
    this.config.validFiletypes = e, e ? this.setAttribute("valid-filetypes", e.join(",")) : this.removeAttribute("valid-filetypes");
  }
  get maxFileSize() {
    return this.config.maxFileSize || 5120;
  }
  set maxFileSize(e) {
    this.config.maxFileSize = e, this.setAttribute("max-file-size", e.toString());
  }
  get labelDropFiles() {
    return this.config.labelDropFiles;
  }
  set labelDropFiles(e) {
    this.config.labelDropFiles = e, e ? this.setAttribute("label-drop-files", e) : this.removeAttribute("label-drop-files"), this.updateLabels();
  }
  get labelBrowse() {
    return this.config.labelBrowse;
  }
  set labelBrowse(e) {
    this.config.labelBrowse = e, e ? this.setAttribute("label-browse", e) : this.removeAttribute("label-browse"), this.updateLabels();
  }
  get folder() {
    return this.config.folder;
  }
  set folder(e) {
    this.config.folder = e, e ? this.setAttribute("folder", e) : this.removeAttribute("folder");
  }
  get compact() {
    return !!this.config.compact;
  }
  set compact(e) {
    this.config.compact = e, e ? this.setAttribute("compact", "") : this.removeAttribute("compact"), this.updateCompactMode();
  }
  set onfilecomplete(e) {
    this.config.onfilecomplete = e;
  }
  set onuploadcomplete(e) {
    this.config.onuploadcomplete = e;
  }
  set parseResponse(e) {
    this.config.parseResponse = e;
  }
  /**
   * Updates labels in the DOM when properties change
   */
  updateLabels() {
    const e = this.shadowRoot.querySelector(".upload-text"), i = this.shadowRoot.querySelector("#browseBtn");
    e && (e.textContent = this.config.labelDropFiles || "Drop files here"), i && (i.textContent = this.config.labelBrowse || "Browse Files");
  }
  /**
   * Updates compact mode styles and attributes
   */
  updateCompactMode() {
    const e = this.shadowRoot.querySelector(".container"), i = this.shadowRoot.querySelector("#fileInput");
    this.config.compact ? (e?.classList.add("compact"), i?.removeAttribute("multiple")) : (e?.classList.remove("compact"), i?.setAttribute("multiple", ""));
  }
  /**
   * Formats bytes to human readable string
   */
  formatBytes(e) {
    if (e === 0) return "0 Bytes";
    const i = 1024, o = ["Bytes", "KB", "MB", "GB"], t = Math.floor(Math.log(e) / Math.log(i));
    return Math.round(e / Math.pow(i, t) * 100) / 100 + " " + o[t];
  }
  /**
   * Generates a unique ID for a file
   */
  generateFileId() {
    return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Validates a file based on config
   */
  validateFile(e) {
    const i = this.maxFileSize * 1024 * 1024;
    if (e.size > i)
      return {
        valid: !1,
        error: `File size exceeds maximum of ${this.formatBytes(i)}`
      };
    if (this.config.validFiletypes && this.config.validFiletypes.length > 0) {
      const o = e.name.split(".").pop()?.toLowerCase();
      if (!o || !this.config.validFiletypes.includes(o))
        return {
          valid: !1,
          error: `File type .${o} is not allowed. Valid types: ${this.config.validFiletypes.join(", ")}`
        };
    }
    return { valid: !0 };
  }
  /**
   * Generates a preview for image files
   */
  async generatePreview(e) {
    if (e.type.startsWith("image/"))
      return new Promise((i) => {
        const o = new FileReader();
        o.onload = (t) => i(t.target?.result), o.onerror = () => i(void 0), o.readAsDataURL(e);
      });
  }
  /**
   * Adds files to the upload queue
   */
  async addFiles(e) {
    this.config.compact && this.files.clear();
    const i = Array.from(e), o = this.config.compact ? [i[0]] : i;
    for (const t of o) {
      if (!t) continue;
      const r = this.validateFile(t), s = this.generateFileId(), a = {
        id: s,
        file: t,
        status: r.valid ? "pending" : "error",
        progress: 0,
        uploadedBytes: 0,
        error: r.error
      };
      r.valid && t.type.startsWith("image/") && (a.preview = await this.generatePreview(t)), this.files.set(s, a);
    }
    this.renderFileCards();
  }
  /**
   * Removes a file from the queue
   */
  removeFile(e) {
    this.files.delete(e), this.renderFileCards();
  }
  /**
   * Uploads a single file with chunking
   */
  async uploadFile(e) {
    if (!this.config.serverURL)
      throw new Error("Server URL is not configured");
    const i = this.config.serverURL.replace(/\/$/, ""), { file: o } = e;
    e.status = "uploading", e.progress = 0, this.updateFileCard(e.id);
    try {
      const t = {
        "Content-Type": "application/json"
      };
      this.config.authToken && (t.Authorization = `Bearer ${this.config.authToken}`);
      const r = await fetch(`${i}/api/upload/initiate`, {
        method: "POST",
        mode: "cors",
        headers: t,
        body: JSON.stringify({
          fileName: o.name,
          fileType: o.type,
          folder: this.config.folder
        }),
        signal: this.abortController?.signal
      });
      if (!r.ok)
        throw new Error(`Failed to initiate upload: ${await r.text()}`);
      let s = await r.json();
      this.config.parseResponse && (s = this.config.parseResponse(s, "initiate"));
      const { uploadId: a, key: d } = s;
      e.uploadId = a, e.key = d;
      const c = this.config.chunkSize * 1024 * 1024, y = Math.ceil(o.size / c), f = [];
      for (let n = 1; n <= y; n++) {
        if (this.abortController?.signal.aborted)
          throw new Error("Upload aborted by user");
        const g = (n - 1) * c, b = Math.min(g + c, o.size), x = o.slice(g, b), m = {
          "Content-Type": "application/octet-stream",
          "X-Upload-Id": a,
          "X-Key": d,
          "X-Part-Number": n.toString()
        };
        this.config.authToken && (m.Authorization = `Bearer ${this.config.authToken}`);
        const v = await fetch(`${i}/api/upload/part`, {
          method: "POST",
          mode: "cors",
          headers: m,
          body: x,
          signal: this.abortController?.signal
        });
        if (!v.ok)
          throw new Error(`Failed to upload part ${n}`);
        let p = await v.json();
        this.config.parseResponse && (p = this.config.parseResponse(p, "part"));
        const { etag: w } = p;
        f.push({ partNumber: n, etag: w }), e.uploadedBytes = b, e.progress = e.uploadedBytes / o.size * 100, this.updateFileCard(e.id);
      }
      const h = await fetch(`${i}/api/upload/complete`, {
        method: "POST",
        mode: "cors",
        headers: t,
        body: JSON.stringify({
          uploadId: a,
          key: d,
          parts: f
        }),
        signal: this.abortController?.signal
      });
      if (!h.ok)
        throw new Error("Failed to complete upload");
      let u = await h.json();
      this.config.parseResponse && (u = this.config.parseResponse(u, "complete")), e.status = "completed", e.progress = 100, this.updateFileCard(e.id), this.dispatchEvent(
        new CustomEvent("filecomplete", {
          detail: e,
          bubbles: !0,
          composed: !0
        })
      ), this.config.onfilecomplete && this.config.onfilecomplete(e);
    } catch (t) {
      throw t instanceof Error && (t.name === "AbortError" || t.message === "Upload aborted by user") || (e.status = "error", e.error = t instanceof Error ? t.message : "Unknown error", this.updateFileCard(e.id)), t;
    }
  }
  /**
   * Starts uploading all pending files
   */
  async startUpload() {
    if (this.isUploading) return;
    const e = Array.from(this.files.values()).filter((t) => t.status === "pending");
    if (e.length === 0) return;
    this.isUploading = !0, this.abortController = new AbortController();
    const i = this.shadowRoot.querySelector("#uploadBtn"), o = this.shadowRoot.querySelector("#abortBtn");
    i && (i.disabled = !0, i.textContent = "Uploading..."), o && (o.style.display = "inline-block");
    try {
      for (const t of e) {
        if (this.abortController.signal.aborted)
          break;
        await this.uploadFile(t);
      }
      this.dispatchEvent(
        new CustomEvent("uploadcomplete", {
          detail: Array.from(this.files.values()),
          bubbles: !0,
          composed: !0
        })
      ), this.config.onuploadcomplete && this.config.onuploadcomplete(Array.from(this.files.values()));
    } catch (t) {
      t instanceof Error && t.message !== "Upload aborted by user" && console.error("Upload error:", t);
    } finally {
      this.isUploading = !1, i && (i.disabled = !1, i.textContent = "Upload Files"), o && (o.style.display = "none");
    }
  }
  /**
   * Aborts all pending and uploading files
   */
  async abortAllUploads() {
    this.abortController && this.abortController.abort();
    const e = Array.from(this.files.values()).filter(
      (r) => r.status === "pending" || r.status === "uploading"
    );
    if (e.length === 0) return;
    const i = {
      "Content-Type": "application/json"
    };
    this.config.authToken && (i.Authorization = `Bearer ${this.config.authToken}`);
    for (const r of e) {
      if (r.uploadId && r.key)
        try {
          const s = this.config.serverURL.replace(/\/$/, "");
          await fetch(`${s}/api/upload/abort`, {
            method: "POST",
            mode: "cors",
            headers: i,
            body: JSON.stringify({
              uploadId: r.uploadId,
              key: r.key
            })
          });
        } catch (s) {
          console.error(`Failed to abort upload for ${r.file.name}:`, s);
        }
      r.status = "aborted", r.error = "Upload aborted by user", this.updateFileCard(r.id);
    }
    this.dispatchEvent(
      new CustomEvent("uploadaborted", {
        detail: e,
        bubbles: !0,
        composed: !0
      })
    ), this.isUploading = !1;
    const o = this.shadowRoot.querySelector("#uploadBtn"), t = this.shadowRoot.querySelector("#abortBtn");
    o && (o.disabled = !1, o.textContent = "Upload Files"), t && (t.style.display = "none");
  }
  /**
   * Updates a single file card in the DOM
   */
  updateFileCard(e) {
    const i = this.files.get(e);
    if (!i) return;
    const o = this.shadowRoot.querySelector(`[data-file-id="${e}"]`);
    if (!o) return;
    const t = o.querySelector(".progress-bar"), r = o.querySelector(".progress-text"), s = o.querySelector(".status");
    t && (t.style.width = `${i.progress}%`, i.status === "completed" ? t.style.backgroundColor = "#22c55e" : i.status === "error" ? t.style.backgroundColor = "#ef4444" : i.status === "aborted" ? t.style.backgroundColor = "#f59e0b" : t.style.backgroundColor = "var(--color-primary)"), r && (r.textContent = `${Math.round(i.progress)}%`), s && i.error && (s.textContent = i.error, s.style.display = "block");
  }
  /**
   * Renders all file cards
   */
  renderFileCards() {
    const e = this.shadowRoot.querySelector("#fileCardsContainer");
    if (!e) return;
    if (this.files.size === 0) {
      e.innerHTML = "";
      return;
    }
    e.innerHTML = Array.from(this.files.values()).map((t) => `
      <div class="file-card" data-file-id="${t.id}">
        <button class="remove-btn" data-file-id="${t.id}">×</button>
        ${t.preview ? `<div class="preview"><img src="${t.preview}" alt="Preview"></div>` : '<div class="preview no-preview">📄</div>'}
        <div class="file-info">
          <div class="file-name" title="${t.file.name}">${t.file.name}</div>
          <div class="file-size">${this.formatBytes(t.file.size)}</div>
        </div>
        <div class="progress-container">
          <div class="progress-bar-bg">
            <div class="progress-bar" style="width: ${t.progress}%; background-color: ${t.status === "completed" ? "#22c55e" : t.status === "error" ? "#ef4444" : "var(--color-primary)"}"></div>
          </div>
          <div class="progress-text">${Math.round(t.progress)}%</div>
        </div>
        ${t.error ? `<div class="status error">${t.error}</div>` : ""}
      </div>
    `).join(""), e.querySelectorAll(".remove-btn").forEach((t) => {
      t.addEventListener("click", (r) => {
        r.stopPropagation();
        const s = t.dataset.fileId;
        s && this.removeFile(s);
      });
    });
    const o = this.shadowRoot.querySelector("#uploadBtn");
    if (o) {
      const t = Array.from(this.files.values()).some((r) => r.status === "pending");
      o.style.display = t ? "block" : "none";
    }
  }
  /**
   * Binds event listeners
   */
  bindEvents() {
    const e = this.shadowRoot.querySelector("#uploadZone"), i = this.shadowRoot.querySelector("#fileInput"), o = this.shadowRoot.querySelector("#browseBtn"), t = this.shadowRoot.querySelector("#uploadBtn"), r = this.shadowRoot.querySelector("#abortBtn");
    o?.addEventListener("click", () => i?.click()), e?.addEventListener("dragover", (s) => {
      s.preventDefault(), e.classList.add("drag-over");
    }), e?.addEventListener("dragleave", () => {
      e.classList.remove("drag-over");
    }), e?.addEventListener("drop", (s) => {
      s.preventDefault(), e.classList.remove("drag-over"), s.dataTransfer?.files && this.addFiles(s.dataTransfer.files);
    }), i?.addEventListener("change", (s) => {
      const a = s.target.files;
      a && (this.addFiles(a), i.value = "");
    }), t?.addEventListener("click", () => this.startUpload()), r?.addEventListener("click", () => this.abortAllUploads());
  }
  /**
   * Renders the component
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          width: 100%;
        }

        .upload-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .upload-zone:hover {
          border-color: #4CAF50;
          background: #f0f9f0;
        }

        .upload-zone.drag-over {
          border-color: #4CAF50;
          background: #e8f5e9;
        }

        .upload-zone-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .upload-text {
          font-size: 18px;
          margin-bottom: 8px;
          color: #333;
        }

        .upload-hint {
          font-size: 14px;
          color: #666;
        }

        .browse-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 16px;
          transition: background 0.3s ease;
          pointer-events: auto;
        }

        .browse-btn:hover {
          background: #45a049;
        }

        input[type="file"] {
          display: none;
        }

        .file-cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }

        .file-card {
          position: relative;
          width: 200px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }

        .file-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.3s ease;
          z-index: 1;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 1);
        }

        .preview {
          width: 100%;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview.no-preview {
          font-size: 48px;
        }

        .file-info {
          margin-bottom: 8px;
        }

        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }

        .file-size {
          font-size: 12px;
          color: #666;
        }

        .progress-container {
          margin-top: 8px;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-bar {
          height: 100%;
          background: var(--color-primary, #4CAF50);
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
          text-align: center;
        }

        .status {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
          display: none;
        }

        .status.error {
          display: block;
        }

        .upload-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.3s ease;
          display: none;
        }

        .upload-btn:hover:not(:disabled) {
          background: #45a049;
        }

        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .abort-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 24px;
          margin-left: 12px;
          transition: background 0.3s ease;
          display: none;
        }

        .abort-btn:hover {
          background: #dc2626;
        }

        .buttons-container {
          display: flex;
          align-items: center;
        }

        /* Compact Mode Styles */
        .container.compact .upload-zone {
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .container.compact .upload-icon,
        .container.compact .upload-hint {
          display: none;
        }

        .container.compact .upload-text {
          font-size: 14px;
          margin-bottom: 0;
        }

        .container.compact .browse-btn {
          margin-top: 0;
          padding: 6px 12px;
          font-size: 14px;
        }

        .container.compact .file-cards-container {
          margin-top: 12px;
        }

        .container.compact .file-card {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 8px;
          height: auto;
        }

        .container.compact .preview {
          display: none !important;
        }

        .container.compact .file-info {
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 0 0 auto;
        }

        .container.compact .file-name {
          margin-bottom: 0;
          max-width: 150px;
        }

        .container.compact .progress-container {
          margin-top: 0;
          flex: 1;
          margin-left: 12px;
          margin-right: 32px;
        }

        .container.compact .remove-btn {
          top: 50%;
          transform: translateY(-50%);
        }
      </style>

      <div class="container">
        <div class="upload-zone" id="uploadZone">
          <input type="file" id="fileInput" multiple>
          <div class="upload-zone-content">
            <div class="upload-icon">📁</div>
            <div class="upload-text">${this.config.labelDropFiles || "Drop files here"}</div>
            <div class="upload-hint">or</div>
            <button class="browse-btn" id="browseBtn">${this.config.labelBrowse || "Browse Files"}</button>
          </div>
        </div>

        <div class="file-cards-container" id="fileCardsContainer"></div>

        <div class="buttons-container">
          <button class="upload-btn" id="uploadBtn">Upload Files</button>
          <button class="abort-btn" id="abortBtn">Abort Upload</button>
        </div>
      </div>
    `;
  }
}
const S = (l = "liwe3-chunk-uploader") => {
  typeof window < "u" && !customElements.get(l) && customElements.define(l, k);
};
typeof window < "u" && S();
export {
  k as ChunkUploaderElement,
  S as defineChunkUploader
};
//# sourceMappingURL=ChunkUploader.js.map
