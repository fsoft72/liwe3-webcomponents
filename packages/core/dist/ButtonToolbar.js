class l extends HTMLElement {
  constructor() {
    super(), this._groups = [], this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["orientation", "groups"];
  }
  attributeChangedCallback(o, i, n) {
    i !== n && this.render();
  }
  get orientation() {
    return this.getAttribute("orientation") || "horizontal";
  }
  set orientation(o) {
    this.setAttribute("orientation", o);
  }
  get groups() {
    const o = this.getAttribute("groups");
    if (o)
      try {
        return JSON.parse(o);
      } catch (i) {
        return console.error("Invalid groups format:", i), [];
      }
    return this._groups;
  }
  set groups(o) {
    this._groups = o, this.setAttribute("groups", JSON.stringify(o));
  }
  connectedCallback() {
    this.render();
  }
  handleButtonClick(o, i) {
    o.disabled || this.dispatchEvent(new CustomEvent("button-click", {
      detail: {
        id: o.id,
        action: o.action || o.id,
        originalEvent: i,
        item: o
      },
      bubbles: !0,
      composed: !0
    }));
  }
  render() {
    if (!this.shadowRoot) return;
    const o = `
      :host {
        display: block;
        font-family: var(--liwe3-font-family, system-ui, -apple-system, sans-serif);
      }

      .toolbar {
        display: flex;
        gap: var(--liwe3-toolbar-gap, 0.5rem);
        width: 100%;
        box-sizing: border-box;
      }

      .toolbar.horizontal {
        flex-direction: row;
        align-items: center;
      }

      .toolbar.vertical {
        flex-direction: column;
        align-items: stretch;
      }

      .group {
        display: flex;
        gap: 1px; /* Gap between buttons in a group */
        background-color: var(--liwe3-toolbar-group-bg, transparent);
        border-radius: var(--liwe3-toolbar-radius, 0.375rem);
        overflow: hidden;
      }

      .toolbar.horizontal .group {
        flex-direction: row;
      }

      .toolbar.vertical .group {
        flex-direction: column;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: var(--liwe3-button-padding, 0.5rem 1rem);
        border: none;
        cursor: pointer;
        font-size: var(--liwe3-button-font-size, 0.875rem);
        line-height: 1.25;
        transition: all 0.2s;
        background-color: var(--liwe3-button-bg, #f3f4f6);
        color: var(--liwe3-button-color, #1f2937);
        min-height: var(--liwe3-button-height, 2.5rem);
      }

      .button:hover:not(:disabled) {
        filter: brightness(0.95);
      }

      .button:active:not(:disabled) {
        filter: brightness(0.9);
      }

      .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Button Types */
      .button.default {
        background-color: var(--liwe3-button-default-bg, #f3f4f6);
        color: var(--liwe3-button-default-color, #1f2937);
      }

      .button.info {
        background-color: var(--liwe3-button-info-bg, #3b82f6);
        color: var(--liwe3-button-info-color, #ffffff);
      }

      .button.error {
        background-color: var(--liwe3-button-error-bg, #ef4444);
        color: var(--liwe3-button-error-color, #ffffff);
      }

      .button.warn {
        background-color: var(--liwe3-button-warn-bg, #f59e0b);
        color: var(--liwe3-button-warn-color, #ffffff);
      }
      
      .button.success {
        background-color: var(--liwe3-button-success-bg, #10b981);
        color: var(--liwe3-button-success-color, #ffffff);
      }

      /* Content styling */
      .icon {
        width: 1.25em;
        height: 1.25em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }

      .image {
        width: 1.5em;
        height: 1.5em;
        object-fit: cover;
        border-radius: 50%;
      }
      
      /* Group styling - rounded corners logic */
      .toolbar.horizontal .group .button:first-child {
        border-top-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-bottom-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
      
      .toolbar.horizontal .group .button:last-child {
        border-top-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-bottom-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
      
      .toolbar.vertical .group .button:first-child {
        border-top-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-top-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
      
      .toolbar.vertical .group .button:last-child {
        border-bottom-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-bottom-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
    `, i = (t) => {
      const e = document.createElement("button");
      if (e.className = `button ${t.type || "default"}`, t.disabled && (e.disabled = !0), t.tooltip && (e.title = t.tooltip), e.onclick = (r) => this.handleButtonClick(t, r), t.icon) {
        const r = document.createElement("span");
        if (r.className = "icon", t.icon.trim().startsWith("<"))
          r.innerHTML = t.icon;
        else {
          const a = document.createElement("i");
          a.className = t.icon, r.appendChild(a);
        }
        e.appendChild(r);
      }
      if (t.image) {
        const r = document.createElement("img");
        r.src = t.image, r.className = "image", r.alt = t.label || "", e.appendChild(r);
      }
      if (t.label) {
        const r = document.createElement("span");
        r.textContent = t.label, e.appendChild(r);
      }
      return e;
    }, n = document.createElement("div");
    n.className = `toolbar ${this.orientation}`, this._groups.forEach((t) => {
      const e = document.createElement("div");
      e.className = `group ${t.class || ""}`, t.items.forEach((r) => {
        e.appendChild(i(r));
      }), n.appendChild(e);
    }), this.shadowRoot.innerHTML = `<style>${o}</style>`, this.shadowRoot.appendChild(n);
  }
}
const u = () => {
  typeof window < "u" && !customElements.get("liwe3-button-toolbar") && customElements.define("liwe3-button-toolbar", l);
};
export {
  l as ButtonToolbarElement,
  u as defineButtonToolbar
};
//# sourceMappingURL=ButtonToolbar.js.map
