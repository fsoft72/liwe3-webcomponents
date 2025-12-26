class n extends HTMLElement {
  constructor() {
    super(), this._libUrl = "https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js", this._value = "", this._isLibLoaded = !1, this._isLoadingLib = !1, this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["lib-url", "value"];
  }
  connectedCallback() {
    this.loadLibrary();
  }
  attributeChangedCallback(e, o, i) {
    o !== i && (e === "lib-url" ? (this._libUrl = i, this._isLibLoaded = !1, this.loadLibrary()) : e === "value" && this._value !== i && (this.value = i));
  }
  get libUrl() {
    return this._libUrl;
  }
  set libUrl(e) {
    this.setAttribute("lib-url", e);
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this._value = e, this.updateContent();
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .markdown-body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 15px;
        }
        img {
          max-width: 100%;
        }
        pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          padding: 16px;
          overflow: auto;
        }
        code {
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          font-size: 85%;
          background-color: rgba(175, 184, 193, 0.2);
          padding: 0.2em 0.4em;
          border-radius: 6px;
        }
        pre code {
          background-color: transparent;
          padding: 0;
        }
        blockquote {
          border-left: 0.25em solid #d0d7de;
          color: #656d76;
          padding: 0 1em;
          margin: 0;
        }
        table {
          border-spacing: 0;
          border-collapse: collapse;
          display: block;
          width: max-content;
          max-width: 100%;
          overflow: auto;
        }
        table th,
        table td {
          padding: 6px 13px;
          border: 1px solid #d0d7de;
        }
        table tr {
          background-color: #ffffff;
          border-top: 1px solid #d8dee4;
        }
        table tr:nth-child(2n) {
          background-color: #f6f8fa;
        }
      </style>
      <div class="markdown-body" id="content"></div>
    `, this.container = this.shadowRoot.getElementById("content");
  }
  async loadLibrary() {
    if (!(this._isLibLoaded || this._isLoadingLib)) {
      if (typeof window.marked == "function" || typeof window.marked == "object" && typeof window.marked.parse == "function") {
        this._isLibLoaded = !0, this.updateContent();
        return;
      }
      this._isLoadingLib = !0;
      try {
        const e = document.createElement("script");
        e.src = this._libUrl, e.onload = () => {
          if (!window.marked) {
            console.error("MarkdownPreview: Library loaded but window.marked is undefined"), this.container.innerHTML = '<div style="color: red;">Error: Markdown library loaded but not found. Try a different URL.</div>', this._isLoadingLib = !1;
            return;
          }
          this._isLibLoaded = !0, this._isLoadingLib = !1, this.updateContent(), this.dispatchEvent(new CustomEvent("library-loaded"));
        }, e.onerror = () => {
          this._isLoadingLib = !1, console.error(`Failed to load markdown library from ${this._libUrl}`), this.container.innerHTML = '<div style="color: red;">Error loading markdown library</div>';
        }, document.head.appendChild(e);
      } catch (e) {
        this._isLoadingLib = !1, console.error(e);
      }
    }
  }
  updateContent() {
    if (!this._isLibLoaded) {
      this._isLoadingLib || this.loadLibrary();
      return;
    }
    const e = window.marked;
    if (!e) {
      console.error("Marked library loaded but not found in window");
      return;
    }
    try {
      const o = typeof e == "function" ? e : e.parse;
      if (typeof o == "function") {
        const i = o(this._value);
        i instanceof Promise ? i.then((t) => {
          this.container.innerHTML = t;
        }) : this.container.innerHTML = i;
      } else
        console.error("Marked parse function not found"), this.container.innerHTML = '<div style="color: red;">Error: marked.parse not found</div>';
    } catch (o) {
      console.error("Error parsing markdown:", o), this.container.innerHTML = '<div style="color: red;">Error parsing markdown</div>';
    }
  }
}
const d = (r = "liwe3-markdown-preview") => {
  typeof window < "u" && !customElements.get(r) && customElements.define(r, n);
};
d();
export {
  n as MarkdownPreviewElement,
  d as defineMarkdownPreview
};
//# sourceMappingURL=MarkdownPreview.js.map
