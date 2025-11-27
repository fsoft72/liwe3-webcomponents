class x extends HTMLElement {
  constructor() {
    super(), this.files = /* @__PURE__ */ new Map(), this.config = {
      serverURL: "",
      chunkSize: 5,
      maxFileSize: 5120
    }, this.isUploading = !1, this.abortController = null, this.attachShadow({ mode: "open" }), this.render(), this.bindEvents();
  }
  static get observedAttributes() {
    return ["server-url", "chunk-size", "auth-token", "valid-filetypes", "max-file-size", "label-drop-files", "label-browse", "folder"];
  }
  attributeChangedCallback(e, i, t) {
    if (i !== t)
      switch (e) {
        case "server-url":
          this.config.serverURL = t || "";
          break;
        case "chunk-size":
          this.config.chunkSize = parseFloat(t || String(5));
          break;
        case "auth-token":
          this.config.authToken = t || void 0;
          break;
        case "valid-filetypes":
          this.config.validFiletypes = t ? t.split(",").map((o) => o.trim()) : void 0;
          break;
        case "max-file-size":
          this.config.maxFileSize = parseFloat(t || String(5120));
          break;
        case "label-drop-files":
          this.config.labelDropFiles = t || void 0, this.updateLabels();
          break;
        case "label-browse":
          this.config.labelBrowse = t || void 0, this.updateLabels();
          break;
        case "folder":
          this.config.folder = t || void 0;
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
   * Formats bytes to human readable string
   */
  formatBytes(e) {
    if (e === 0) return "0 Bytes";
    const i = 1024, t = ["Bytes", "KB", "MB", "GB"], o = Math.floor(Math.log(e) / Math.log(i));
    return Math.round(e / Math.pow(i, o) * 100) / 100 + " " + t[o];
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
      const t = e.name.split(".").pop()?.toLowerCase();
      if (!t || !this.config.validFiletypes.includes(t))
        return {
          valid: !1,
          error: `File type .${t} is not allowed. Valid types: ${this.config.validFiletypes.join(", ")}`
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
        const t = new FileReader();
        t.onload = (o) => i(o.target?.result), t.onerror = () => i(void 0), t.readAsDataURL(e);
      });
  }
  /**
   * Adds files to the upload queue
   */
  async addFiles(e) {
    const i = Array.from(e);
    for (const t of i) {
      const o = this.validateFile(t), r = this.generateFileId(), s = {
        id: r,
        file: t,
        status: o.valid ? "pending" : "error",
        progress: 0,
        uploadedBytes: 0,
        error: o.error
      };
      o.valid && t.type.startsWith("image/") && (s.preview = await this.generatePreview(t)), this.files.set(r, s);
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
    const { file: i } = e;
    e.status = "uploading", e.progress = 0, this.updateFileCard(e.id);
    try {
      const t = {
        "Content-Type": "application/json"
      };
      this.config.authToken && (t.Authorization = `Bearer ${this.config.authToken}`);
      const o = await fetch(`${this.config.serverURL}/api/upload/initiate`, {
        method: "POST",
        headers: t,
        body: JSON.stringify({
          fileName: i.name,
          fileType: i.type,
          folder: this.config.folder
        })
      });
      if (!o.ok)
        throw new Error(`Failed to initiate upload: ${await o.text()}`);
      let r = await o.json();
      this.config.parseResponse && (r = this.config.parseResponse(r, "initiate"));
      const { uploadId: s, key: a } = r;
      e.uploadId = s, e.key = a;
      const d = this.config.chunkSize * 1024 * 1024, m = Math.ceil(i.size / d), p = [];
      for (let n = 1; n <= m; n++) {
        if (this.abortController?.signal.aborted)
          throw new Error("Upload aborted by user");
        const u = (n - 1) * d, b = Math.min(u + d, i.size), y = i.slice(u, b), g = {
          "Content-Type": "application/octet-stream",
          "X-Upload-Id": s,
          "X-Key": a,
          "X-Part-Number": n.toString()
        };
        this.config.authToken && (g.Authorization = `Bearer ${this.config.authToken}`);
        const v = await fetch(`${this.config.serverURL}/api/upload/part`, {
          method: "POST",
          headers: g,
          body: y,
          signal: this.abortController?.signal
        });
        if (!v.ok)
          throw new Error(`Failed to upload part ${n}`);
        let c = await v.json();
        this.config.parseResponse && (c = this.config.parseResponse(c, "part"));
        const { etag: w } = c;
        p.push({ partNumber: n, etag: w }), e.uploadedBytes = b, e.progress = e.uploadedBytes / i.size * 100, this.updateFileCard(e.id);
      }
      const h = await fetch(`${this.config.serverURL}/api/upload/complete`, {
        method: "POST",
        headers: t,
        body: JSON.stringify({
          uploadId: s,
          key: a,
          parts: p
        })
      });
      if (!h.ok)
        throw new Error("Failed to complete upload");
      let f = await h.json();
      this.config.parseResponse && (f = this.config.parseResponse(f, "complete")), e.status = "completed", e.progress = 100, this.updateFileCard(e.id), this.dispatchEvent(
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
    const e = Array.from(this.files.values()).filter((o) => o.status === "pending");
    if (e.length === 0) return;
    this.isUploading = !0, this.abortController = new AbortController();
    const i = this.shadowRoot.querySelector("#uploadBtn"), t = this.shadowRoot.querySelector("#abortBtn");
    i && (i.disabled = !0, i.textContent = "Uploading..."), t && (t.style.display = "inline-block");
    try {
      for (const o of e) {
        if (this.abortController.signal.aborted)
          break;
        await this.uploadFile(o);
      }
      this.dispatchEvent(
        new CustomEvent("uploadcomplete", {
          detail: Array.from(this.files.values()),
          bubbles: !0,
          composed: !0
        })
      ), this.config.onuploadcomplete && this.config.onuploadcomplete(Array.from(this.files.values()));
    } catch (o) {
      o instanceof Error && o.message !== "Upload aborted by user" && console.error("Upload error:", o);
    } finally {
      this.isUploading = !1, i && (i.disabled = !1, i.textContent = "Upload Files"), t && (t.style.display = "none");
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
          await fetch(`${this.config.serverURL}/api/upload/abort`, {
            method: "POST",
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
    const t = this.shadowRoot.querySelector("#uploadBtn"), o = this.shadowRoot.querySelector("#abortBtn");
    t && (t.disabled = !1, t.textContent = "Upload Files"), o && (o.style.display = "none");
  }
  /**
   * Updates a single file card in the DOM
   */
  updateFileCard(e) {
    const i = this.files.get(e);
    if (!i) return;
    const t = this.shadowRoot.querySelector(`[data-file-id="${e}"]`);
    if (!t) return;
    const o = t.querySelector(".progress-bar"), r = t.querySelector(".progress-text"), s = t.querySelector(".status");
    o && (o.style.width = `${i.progress}%`, i.status === "completed" ? o.style.backgroundColor = "#22c55e" : i.status === "error" ? o.style.backgroundColor = "#ef4444" : i.status === "aborted" ? o.style.backgroundColor = "#f59e0b" : o.style.backgroundColor = "var(--color-primary)"), r && (r.textContent = `${Math.round(i.progress)}%`), s && i.error && (s.textContent = i.error, s.style.display = "block");
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
    e.innerHTML = Array.from(this.files.values()).map((o) => `
      <div class="file-card" data-file-id="${o.id}">
        <button class="remove-btn" data-file-id="${o.id}">×</button>
        ${o.preview ? `<div class="preview"><img src="${o.preview}" alt="Preview"></div>` : '<div class="preview no-preview">📄</div>'}
        <div class="file-info">
          <div class="file-name" title="${o.file.name}">${o.file.name}</div>
          <div class="file-size">${this.formatBytes(o.file.size)}</div>
        </div>
        <div class="progress-container">
          <div class="progress-bar-bg">
            <div class="progress-bar" style="width: ${o.progress}%; background-color: ${o.status === "completed" ? "#22c55e" : o.status === "error" ? "#ef4444" : "var(--color-primary)"}"></div>
          </div>
          <div class="progress-text">${Math.round(o.progress)}%</div>
        </div>
        ${o.error ? `<div class="status error">${o.error}</div>` : ""}
      </div>
    `).join(""), e.querySelectorAll(".remove-btn").forEach((o) => {
      o.addEventListener("click", (r) => {
        r.stopPropagation();
        const s = o.dataset.fileId;
        s && this.removeFile(s);
      });
    });
    const t = this.shadowRoot.querySelector("#uploadBtn");
    if (t) {
      const o = Array.from(this.files.values()).some((r) => r.status === "pending");
      t.style.display = o ? "block" : "none";
    }
  }
  /**
   * Binds event listeners
   */
  bindEvents() {
    const e = this.shadowRoot.querySelector("#uploadZone"), i = this.shadowRoot.querySelector("#fileInput"), t = this.shadowRoot.querySelector("#browseBtn"), o = this.shadowRoot.querySelector("#uploadBtn"), r = this.shadowRoot.querySelector("#abortBtn");
    t?.addEventListener("click", () => i?.click()), e?.addEventListener("dragover", (s) => {
      s.preventDefault(), e.classList.add("drag-over");
    }), e?.addEventListener("dragleave", () => {
      e.classList.remove("drag-over");
    }), e?.addEventListener("drop", (s) => {
      s.preventDefault(), e.classList.remove("drag-over"), s.dataTransfer?.files && this.addFiles(s.dataTransfer.files);
    }), i?.addEventListener("change", (s) => {
      const a = s.target.files;
      a && (this.addFiles(a), i.value = "");
    }), o?.addEventListener("click", () => this.startUpload()), r?.addEventListener("click", () => this.abortAllUploads());
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
const k = (l = "liwe3-chunk-uploader") => {
  typeof window < "u" && !customElements.get(l) && customElements.define(l, x);
};
typeof window < "u" && k();
export {
  x as ChunkUploaderElement,
  k as defineChunkUploader
};
//# sourceMappingURL=ChunkUploader.js.map
