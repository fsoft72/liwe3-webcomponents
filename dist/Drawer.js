class n extends HTMLElement {
  constructor() {
    super(), this.currentState = "expanded", this.config = {
      direction: "horizontal",
      duration: 300,
      showTitleWhenShrunk: !1,
      closable: !0,
      title: "",
      icon: "☰",
      showToggleButton: !0,
      contentPadding: "16px"
    }, this.attachShadow({ mode: "open" }), this.render(), this.bindEvents();
  }
  static get observedAttributes() {
    return ["direction", "duration", "show-title-when-shrunk", "closable", "title", "icon", "state", "show-toggle-button", "content-padding"];
  }
  attributeChangedCallback(t, r, e) {
    if (r !== e) {
      switch (t) {
        case "direction":
          this.config.direction = e || "horizontal";
          break;
        case "duration":
          this.config.duration = parseInt(e || "300", 10);
          break;
        case "show-title-when-shrunk":
          this.config.showTitleWhenShrunk = e === "true";
          break;
        case "closable":
          this.config.closable = e !== "false";
          break;
        case "title":
          this.config.title = e || "";
          break;
        case "icon":
          this.config.icon = e || "☰";
          break;
        case "state":
          this.currentState = e || "expanded";
          break;
        case "show-toggle-button":
          this.config.showToggleButton = e !== "false";
          break;
        case "content-padding":
          this.config.contentPadding = e ?? void 0;
          break;
      }
      this.render();
    }
  }
  get direction() {
    return this.config.direction;
  }
  set direction(t) {
    this.config.direction = t, this.setAttribute("direction", t);
  }
  get duration() {
    return this.config.duration;
  }
  set duration(t) {
    this.config.duration = t, this.setAttribute("duration", t.toString());
  }
  get showTitleWhenShrunk() {
    return this.config.showTitleWhenShrunk;
  }
  set showTitleWhenShrunk(t) {
    this.config.showTitleWhenShrunk = t, this.setAttribute("show-title-when-shrunk", t.toString());
  }
  get closable() {
    return this.config.closable;
  }
  set closable(t) {
    this.config.closable = t, this.setAttribute("closable", t.toString());
  }
  get title() {
    return this.config.title;
  }
  set title(t) {
    this.config.title = t, this.setAttribute("title", t);
  }
  get icon() {
    return this.config.icon;
  }
  set icon(t) {
    this.config.icon = t, this.setAttribute("icon", t);
  }
  get showToggleButton() {
    return this.config.showToggleButton;
  }
  set showToggleButton(t) {
    this.config.showToggleButton = t, this.setAttribute("show-toggle-button", t.toString());
  }
  get contentPadding() {
    return this.config.contentPadding ?? "16px";
  }
  set contentPadding(t) {
    this.config.contentPadding = t, this.setAttribute("content-padding", t);
  }
  get state() {
    return this.currentState;
  }
  set state(t) {
    this.setState(t);
  }
  /**
   * Expand the drawer
   */
  expand() {
    this.setState("expanded");
  }
  /**
   * Shrink the drawer
   */
  shrink() {
    this.setState("shrunk");
  }
  /**
   * Close the drawer (removes from DOM)
   */
  close() {
    this.setState("closed");
  }
  /**
   * Toggle between expanded and shrunk states
   */
  toggle() {
    this.currentState === "expanded" ? this.shrink() : this.currentState === "shrunk" && this.expand();
  }
  setState(t) {
    const r = this.currentState;
    this.currentState = t, this.setAttribute("state", t);
    const e = this.shadowRoot.querySelector(".drawer-container");
    if (e) {
      if (this.dispatchEvent(new CustomEvent("drawer-state-change", {
        detail: { oldState: r, newState: t },
        bubbles: !0,
        composed: !0
      })), t === "closed") {
        e.style.display = "none", this.dispatchEvent(new CustomEvent("drawer-closed", { bubbles: !0, composed: !0 })), this.remove();
        return;
      }
      if (t === "shrunk") {
        e.style.display = "block", e.classList.add("shrunk"), e.classList.remove("expanded"), this.dispatchEvent(new CustomEvent("drawer-shrunk", { bubbles: !0, composed: !0 }));
        return;
      }
      if (t === "expanded") {
        e.style.display = "block", e.classList.remove("shrunk"), e.classList.add("expanded"), this.dispatchEvent(new CustomEvent("drawer-expanded", { bubbles: !0, composed: !0 }));
        return;
      }
    }
  }
  bindEvents() {
    this.shadowRoot.addEventListener("click", (t) => {
      const r = t.target;
      r.closest(".drawer-toggle") && (t.preventDefault(), this.toggle()), r.closest(".drawer-close") && this.config.closable && (t.preventDefault(), this.close());
    });
  }
  render() {
    const t = this.config.direction === "horizontal", r = this.config.showTitleWhenShrunk, e = this.config.showToggleButton !== !1, o = this.config.contentPadding ?? "16px";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --drawer-duration: ${this.config.duration}ms;
          --drawer-bg: #ffffff;
          --drawer-border: #e5e7eb;
          --drawer-text: #1f2937;
          --drawer-icon-bg: #f3f4f6;
          --drawer-icon-hover: #e5e7eb;
          --drawer-button-hover: #f9fafb;
          --drawer-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Container when expanded */
        .drawer-container {
          background: var(--drawer-bg);
          border: 1px solid var(--drawer-border);
          border-radius: 8px;
          box-shadow: var(--drawer-shadow);
          overflow: hidden;
          position: relative;
        }

        .drawer-container.horizontal {
          width: var(--drawer-horizontal-size, 300px);
          height: auto;
          transition: none;
        }

        .drawer-container.vertical {
          width: auto;
          height: var(--drawer-vertical-size, 300px);
          transition: none;
        }

        .drawer-container.expanded {
          opacity: 1;
        }

        .drawer-container.shrunk.horizontal {
          width: var(--drawer-horizontal-shrunk-size, 48px);
        }

        .drawer-container.shrunk.vertical {
          height: var(--drawer-vertical-shrunk-size, 48px);
        }

        /* Header area with title and buttons */
        .drawer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-bottom: 1px solid var(--drawer-border);
          transition: none;
        }

        .drawer-container.shrunk .drawer-header {
          border-bottom: none;
        }

        .drawer-container.shrunk .drawer-title:not(.keep-visible),
        .drawer-container.shrunk .drawer-close {
          display: none;
        }

        .drawer-container.shrunk .drawer-title.keep-visible {
          display: block;
        }

        .drawer-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--drawer-icon-bg);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .drawer-toggle:hover {
          background: var(--drawer-icon-hover);
        }

        .drawer-title {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: var(--drawer-text);
          transition: none;
          white-space: nowrap;
          overflow: hidden;
        }

        .drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
          transition: none;
          flex-shrink: 0;
        }

        .drawer-close:hover {
          background: var(--drawer-button-hover);
          color: #ef4444;
        }

        /* Content area */
        .drawer-content {
          padding: var(--drawer-content-padding, 16px);
          transition: none;
          overflow: auto;
        }

        .drawer-container.shrunk .drawer-content {
          opacity: 0;
          height: 0;
          padding: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        /* Vertical specific styles */
        .drawer-container.vertical {
          display: flex;
          flex-direction: column;
        }

        .drawer-container.vertical .drawer-content {
          flex: 1;
          overflow: auto;
        }
      </style>

      <div class="drawer-container ${t ? "horizontal" : "vertical"} ${this.currentState}" style="display:block; --drawer-content-padding:${o};">
        <div class="drawer-header">
          ${e ? `
          <button class="drawer-toggle" aria-label="Toggle drawer">
            ${this.config.icon}
          </button>
          ` : ""}
          <div class="drawer-title ${r ? "keep-visible" : ""}">
            ${this.config.title}
          </div>
          ${this.config.closable ? `
            <button class="drawer-close" aria-label="Close drawer">
              ×
            </button>
          ` : ""}
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
customElements.get("liwe3-drawer") || customElements.define("liwe3-drawer", n);
function s(i = "liwe3-drawer") {
  customElements.get(i) || customElements.define(i, n);
}
export {
  n as DrawerElement,
  s as defineDrawer
};
//# sourceMappingURL=Drawer.js.map
