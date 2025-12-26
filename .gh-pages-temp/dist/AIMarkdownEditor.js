import { defineAITextEditor as c } from "./AITextEditor.js";
import { defineButtonToolbar as m } from "./ButtonToolbar.js";
import { defineMarkdownPreview as u } from "./MarkdownPreview.js";
class v extends HTMLElement {
  constructor() {
    super(), this.isPreviewMode = !1, this.markdownLibUrl = "https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js", this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render(), this.init();
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          gap: 0.5rem;
        }
        
        .editor-container {
          flex: 1;
          position: relative;
          min-height: 0; /* Important for flexbox scrolling */
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          background: #fafbfc;
        }
        
        .editor-container:focus-within {
          border-color: #4facfe;
          background: white;
        }

        .editor-status {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 10px;
          height: 10px;
          border-radius: 100%;
          background: #777;
          z-index: 10;
        }
        
        .loading {
          position: absolute;
          top: 5px;
          right: 10px;
          z-index: 10;
          display: none;
        }

        .loading.show {
          display: block;
        }

        .spinner {
          width: 10px;
          height: 10px;
          border: 2px solid #e1e5e9;
          border-top: 2px solid #4facfe;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        liwe3-ai-text-editor {
          width: 100%;
          height: 100%;
        }

        .settings-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 100;
          width: 400px;
          max-width: 90%;
          display: none;
          border: 1px solid #e5e7eb;
        }

        .settings-modal.open {
          display: block;
        }

        .settings-modal h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #1f2937;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          color: #4b5563;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
          display: none;
        }

        .overlay.open {
          display: block;
        }
      </style>
      <liwe3-button-toolbar id="toolbar"></liwe3-button-toolbar>
      <div class="editor-container">
        <div class="editor-status"></div>
        <div class="loading" id="loading">
          <div class="spinner"></div>
        </div>
        <liwe3-ai-text-editor id="editor"></liwe3-ai-text-editor>
        <liwe3-markdown-preview id="preview" style="display: none; width: 100%; height: 100%; overflow: auto;"></liwe3-markdown-preview>
      </div>
      
      <div class="overlay" id="overlay"></div>
      <div class="settings-modal" id="settingsModal">
        <h3>AI Settings</h3>
        <div class="form-group">
          <label for="apiKey">API Key</label>
          <input type="password" id="apiKey" placeholder="sk-...">
        </div>
        <div class="form-group">
          <label for="systemPrompt">System Prompt</label>
          <textarea id="systemPrompt"></textarea>
        </div>
        <div class="form-group">
          <label for="modelName">Model Name</label>
          <input type="text" id="modelName" placeholder="gpt-3.5-turbo">
        </div>
        <div class="form-group">
          <label for="apiEndpoint">API Endpoint</label>
          <input type="text" id="apiEndpoint" placeholder="https://api.openai.com/v1/chat/completions">
        </div>
        <div class="form-group">
          <label for="markdownLibUrl">Markdown Library URL</label>
          <input type="text" id="markdownLibUrl" placeholder="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js">
        </div>
        <div class="form-group">
          <label for="suggestionDelay">Suggestion Delay (seconds)</label>
          <input type="number" id="suggestionDelay" step="0.1" min="0.5">
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" id="saveBtn">Save</button>
        </div>
      </div>
    `;
  }
  init() {
    this.aiEditor = this.shadowRoot.getElementById("editor"), this.preview = this.shadowRoot.getElementById("preview"), this.toolbar = this.shadowRoot.getElementById("toolbar"), this.editorStatus = this.shadowRoot.querySelector(".editor-status"), this.loading = this.shadowRoot.getElementById("loading"), this.aiEditor.configure({
      embedded: !0,
      onStatusChange: (t) => {
        this.editorStatus.style.backgroundColor = t ? "#4caf50" : "#777";
      },
      onLoadingChange: (t) => {
        t ? this.loading.classList.add("show") : this.loading.classList.remove("show");
      }
    }), this.setupModal(), this.setupToolbar(), this.aiEditor.addEventListener("change", (t) => {
      this.dispatchEvent(new CustomEvent("change", {
        detail: t.detail,
        bubbles: !0,
        composed: !0
      }));
    }), this.aiEditor.addEventListener("beforeSuggestion", (t) => {
      this.dispatchEvent(new CustomEvent("beforeSuggestion", {
        detail: t.detail,
        bubbles: !0,
        composed: !0,
        cancelable: !0
      }));
    });
  }
  setupModal() {
    const t = this.shadowRoot.getElementById("settingsModal"), o = this.shadowRoot.getElementById("overlay"), e = this.shadowRoot.getElementById("cancelBtn"), i = this.shadowRoot.getElementById("saveBtn"), s = () => {
      t.classList.remove("open"), o.classList.remove("open");
    };
    e.addEventListener("click", s), o.addEventListener("click", s), i.addEventListener("click", () => {
      const n = this.shadowRoot.getElementById("apiKey").value, d = this.shadowRoot.getElementById("systemPrompt").value, a = this.shadowRoot.getElementById("modelName").value, p = this.shadowRoot.getElementById("apiEndpoint").value, r = this.shadowRoot.getElementById("markdownLibUrl").value, l = parseFloat(this.shadowRoot.getElementById("suggestionDelay").value);
      this.aiEditor.setApiKey(n), this.aiEditor.setSystemPrompt(d), this.aiEditor.setModelName(a), this.aiEditor.setApiEndpoint(p), this.markdownLibUrl = r, isNaN(l) || this.aiEditor.setSuggestionDelay(l), s();
    });
  }
  openSettings() {
    const t = this.shadowRoot.getElementById("settingsModal"), o = this.shadowRoot.getElementById("overlay");
    this.shadowRoot.getElementById("apiKey").value = this.aiEditor.getApiKey(), this.shadowRoot.getElementById("systemPrompt").value = this.aiEditor.getSystemPrompt(), this.shadowRoot.getElementById("modelName").value = this.aiEditor.getModelName(), this.shadowRoot.getElementById("apiEndpoint").value = this.aiEditor.getApiEndpoint(), this.shadowRoot.getElementById("markdownLibUrl").value = this.markdownLibUrl, this.shadowRoot.getElementById("suggestionDelay").value = this.aiEditor.getSuggestionDelay().toString(), t.classList.add("open"), o.classList.add("open");
  }
  setupToolbar() {
    const t = [
      {
        id: "format",
        items: [
          {
            id: "bold",
            label: "B",
            tooltip: "Bold",
            icon: '<svg viewBox="0 0 24 24"><path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.26 7.586A4.5 4.5 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8z"/></svg>'
          },
          {
            id: "italic",
            label: "I",
            tooltip: "Italic",
            icon: '<svg viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>'
          },
          {
            id: "underline",
            label: "U",
            tooltip: "Underline",
            icon: '<svg viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>'
          }
        ]
      },
      {
        id: "lists",
        items: [
          {
            id: "ul",
            label: "UL",
            tooltip: "Unordered List",
            icon: '<svg viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>'
          },
          {
            id: "ol",
            label: "OL",
            tooltip: "Numbered List",
            icon: '<svg viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>'
          }
        ]
      },
      {
        id: "settings",
        items: [
          {
            id: "preview",
            tooltip: "Toggle Preview",
            icon: '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
          },
          {
            id: "settings",
            tooltip: "AI Settings",
            icon: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L4.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.08-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
          }
        ]
      }
    ];
    this.toolbar.groups = t, this.toolbar.addEventListener("button-click", (o) => {
      const e = o.detail;
      this.handleToolbarAction(e.id);
    });
  }
  togglePreview() {
    this.isPreviewMode = !this.isPreviewMode, this.isPreviewMode ? (this.preview.value = this.aiEditor.getText(), this.preview.libUrl = this.markdownLibUrl, this.aiEditor.style.display = "none", this.preview.style.display = "block") : (this.aiEditor.style.display = "block", this.preview.style.display = "none");
  }
  handleToolbarAction(t) {
    if (t === "preview") {
      this.togglePreview();
      return;
    }
    const o = this.aiEditor.shadowRoot?.getElementById("editor");
    if (!o) return;
    const e = o.selectionStart, i = o.selectionEnd, s = o.value, n = s.substring(e, i);
    let d = "", a = i;
    switch (t) {
      case "settings":
        this.openSettings();
        return;
      // Exit early as we don't need text manipulation
      case "bold":
        d = s.substring(0, e) + `**${n}**` + s.substring(i), a = i + 4, e === i && (a = e + 2);
        break;
      case "italic":
        d = s.substring(0, e) + `*${n}*` + s.substring(i), a = i + 2, e === i && (a = e + 1);
        break;
      case "underline":
        d = s.substring(0, e) + `<u>${n}</u>` + s.substring(i), a = i + 7, e === i && (a = e + 3);
        break;
      case "ul":
        if (e !== i) {
          const r = n.split(`
`).map((l) => `- ${l}`).join(`
`);
          d = s.substring(0, e) + r + s.substring(i), a = e + r.length;
        } else
          d = s.substring(0, e) + "- " + s.substring(i), a = e + 2;
        break;
      case "ol":
        if (e !== i) {
          const r = n.split(`
`).map((l, g) => `${g + 1}. ${l}`).join(`
`);
          d = s.substring(0, e) + r + s.substring(i), a = e + r.length;
        } else
          d = s.substring(0, e) + "1. " + s.substring(i), a = e + 3;
        break;
    }
    d && (o.value = d, o.focus(), e === i ? t === "bold" ? o.setSelectionRange(e + 2, e + 2) : t === "italic" ? o.setSelectionRange(e + 1, e + 1) : t === "underline" ? o.setSelectionRange(e + 3, e + 3) : o.setSelectionRange(a, a) : o.setSelectionRange(a, a), o.dispatchEvent(new Event("input", { bubbles: !0 })));
  }
  // Proxy methods to AITextEditor
  setText(t) {
    this.aiEditor && this.aiEditor.setText(t);
  }
  getText() {
    return this.aiEditor ? this.aiEditor.getText() : "";
  }
  setApiKey(t) {
    this.aiEditor && this.aiEditor.setApiKey(t);
  }
  getApiKey() {
    return this.aiEditor ? this.aiEditor.getApiKey() : "";
  }
  setSuggestionDelay(t) {
    this.aiEditor && this.aiEditor.setSuggestionDelay(t);
  }
  getSuggestionDelay() {
    return this.aiEditor ? this.aiEditor.getSuggestionDelay() : 1;
  }
  setSystemPrompt(t) {
    this.aiEditor && this.aiEditor.setSystemPrompt(t);
  }
  getSystemPrompt() {
    return this.aiEditor ? this.aiEditor.getSystemPrompt() : "";
  }
  setApiEndpoint(t) {
    this.aiEditor && this.aiEditor.setApiEndpoint(t);
  }
  getApiEndpoint() {
    return this.aiEditor ? this.aiEditor.getApiEndpoint() : "";
  }
  setModelName(t) {
    this.aiEditor && this.aiEditor.setModelName(t);
  }
  getModelName() {
    return this.aiEditor ? this.aiEditor.getModelName() : "";
  }
  setContext(t) {
    this.aiEditor && this.aiEditor.setContext(t);
  }
  getContext() {
    return this.aiEditor ? this.aiEditor.getContext() : "";
  }
}
const E = (h = "liwe3-ai-markdown-editor") => {
  typeof window < "u" && (c(), m(), u(), customElements.get(h) || customElements.define(h, v));
};
export {
  v as AIMarkdownEditorElement,
  E as defineAIMarkdownEditor
};
//# sourceMappingURL=AIMarkdownEditor.js.map
