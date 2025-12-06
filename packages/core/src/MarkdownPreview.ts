/**
 * MarkdownPreview Web Component
 * Renders markdown content using a dynamically loaded library
 */

export class MarkdownPreviewElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private _libUrl: string = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
  private _value: string = '';
  private _isLibLoaded: boolean = false;
  private _isLoadingLib: boolean = false;
  private container!: HTMLElement;

  static get observedAttributes() {
    return ['lib-url', 'value'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.loadLibrary();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === 'lib-url') {
      this._libUrl = newValue;
      this._isLibLoaded = false; // Reset loaded state if URL changes
      this.loadLibrary();
    } else if (name === 'value') {
      // Only update internal value if it differs, to avoid loops if we were to reflect
      if (this._value !== newValue) {
        this.value = newValue;
      }
    }
  }

  get libUrl(): string {
    return this._libUrl;
  }

  set libUrl(value: string) {
    this.setAttribute('lib-url', value);
  }

  get value(): string {
    return this._value;
  }

  set value(content: string) {
    this._value = content;
    this.updateContent();
    // We do NOT reflect to attribute to avoid performance issues with large content
  }

  private render() {
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
    `;
    this.container = this.shadowRoot.getElementById('content') as HTMLElement;
  }

  private async loadLibrary() {
    if (this._isLibLoaded || this._isLoadingLib) return;

    // Check if marked is already available globally
    if (typeof (window as any).marked === 'function' || (typeof (window as any).marked === 'object' && typeof (window as any).marked.parse === 'function')) {
      this._isLibLoaded = true;
      this.updateContent();
      return;
    }

    this._isLoadingLib = true;

    try {
      const script = document.createElement('script');
      script.src = this._libUrl;
      script.onload = () => {
        // Double check if marked is available
        if (!(window as any).marked) {
          console.error('MarkdownPreview: Library loaded but window.marked is undefined');
          this.container.innerHTML = `<div style="color: red;">Error: Markdown library loaded but not found. Try a different URL.</div>`;
          this._isLoadingLib = false;
          return;
        }
        this._isLibLoaded = true;
        this._isLoadingLib = false;
        this.updateContent();
        this.dispatchEvent(new CustomEvent('library-loaded'));
      };
      script.onerror = () => {
        this._isLoadingLib = false;
        console.error(`Failed to load markdown library from ${this._libUrl}`);
        this.container.innerHTML = `<div style="color: red;">Error loading markdown library</div>`;
      };
      document.head.appendChild(script);
    } catch (e) {
      this._isLoadingLib = false;
      console.error(e);
    }
  }

  private updateContent() {
    if (!this._isLibLoaded) {
      if (!this._isLoadingLib) {
        this.loadLibrary();
      }
      return;
    }

    const marked = (window as any).marked;
    if (!marked) {
       console.error('Marked library loaded but not found in window');
       return;
    }

    try {
      // Handle both function style (older marked) and object style (newer marked)
      const parse = typeof marked === 'function' ? marked : marked.parse;
      if (typeof parse === 'function') {
        const html = parse(this._value);
        // If it returns a promise (async), handle it
        if (html instanceof Promise) {
          html.then((res: string) => {
            this.container.innerHTML = res;
          });
        } else {
          this.container.innerHTML = html;
        }
      } else {
        console.error('Marked parse function not found');
        this.container.innerHTML = `<div style="color: red;">Error: marked.parse not found</div>`;
      }
    } catch (e) {
      console.error('Error parsing markdown:', e);
      this.container.innerHTML = `<div style="color: red;">Error parsing markdown</div>`;
    }
  }
}

export const defineMarkdownPreview = (tagName: string = 'liwe3-markdown-preview') => {
  if (typeof window !== 'undefined' && !customElements.get(tagName)) {
    customElements.define(tagName, MarkdownPreviewElement);
  }
};

defineMarkdownPreview();
