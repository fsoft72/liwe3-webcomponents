class m extends HTMLElement {
  constructor() {
    super(), this.menuPosition = "bottom-left", this.menuItems = [], this.alwaysShowMenu = !1, this.popoverMenu = null, this.menuButton = null, this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render(), this.setupEventListeners();
  }
  disconnectedCallback() {
    this.cleanupEventListeners();
  }
  /**
   * Set menu position
   */
  setMenuPosition(e) {
    this.menuPosition = e, this.updateMenuButtonPosition();
  }
  /**
   * Get menu position
   */
  getMenuPosition() {
    return this.menuPosition;
  }
  /**
   * Set menu items
   */
  setMenuItems(e) {
    this.menuItems = e, this.updatePopoverMenu();
  }
  /**
   * Get menu items
   */
  getMenuItems() {
    return this.menuItems;
  }
  /**
   * Set whether menu button is always visible
   */
  setAlwaysShowMenu(e) {
    this.alwaysShowMenu = e, this.updateMenuButtonVisibility();
  }
  /**
   * Get whether menu button is always visible
   */
  getAlwaysShowMenu() {
    return this.alwaysShowMenu;
  }
  /**
   * Render the component
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .container-box {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .content-wrapper {
          width: 100%;
          height: 100%;
        }

        .menu-button {
          position: absolute;
          background: var(--container-box-menu-bg, #fff);
          border: 1px solid var(--container-box-menu-border, #ddd);
          border-radius: var(--container-box-menu-radius, 4px);
          padding: var(--container-box-menu-padding, 6px 10px);
          cursor: pointer;
          box-shadow: var(--container-box-menu-shadow, 0 2px 8px rgba(0,0,0,0.15));
          z-index: 10;
          opacity: 0;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: var(--container-box-menu-color, #333);
        }

        .menu-button:hover {
          background: var(--container-box-menu-hover-bg, #f5f5f5);
        }

        .container-box:hover .menu-button {
          opacity: 1;
        }

        .menu-button.always-visible {
          opacity: 1;
        }

        .menu-button-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Position variants */
        .menu-button.top-left {
          top: var(--container-box-menu-offset, 8px);
          left: var(--container-box-menu-offset, 8px);
        }

        .menu-button.top-right {
          top: var(--container-box-menu-offset, 8px);
          right: var(--container-box-menu-offset, 8px);
        }

        .menu-button.bottom-left {
          bottom: var(--container-box-menu-offset, 8px);
          left: var(--container-box-menu-offset, 8px);
        }

        .menu-button.bottom-right {
          bottom: var(--container-box-menu-offset, 8px);
          right: var(--container-box-menu-offset, 8px);
        }

        .popover-container {
          position: fixed;
          z-index: 10000;
          pointer-events: none;
        }

        .popover-container > * {
          pointer-events: auto;
        }
      </style>

      <div class="container-box">
        <div class="content-wrapper">
          <slot></slot>
        </div>
        <div class="menu-button ${this.menuPosition} ${this.alwaysShowMenu ? "always-visible" : ""}">
          <span class="menu-button-icon">⋮</span>
        </div>
      </div>
      <div class="popover-container"></div>
    `, this.menuButton = this.shadowRoot.querySelector(".menu-button"), this.createPopoverMenu();
  }
  /**
   * Create the popover menu
   */
  createPopoverMenu() {
  }
  /**
   * Update popover menu items
   */
  updatePopoverMenu() {
  }
  /**
   * Render menu items recursively
   */
  renderMenuItems(e) {
    return e.map((t) => {
      if (t.label === "---sep")
        return '<div class="menu-separator"></div>';
      const o = t.items && t.items.length > 0;
      return `
        <div class="menu-item ${t.enabled === !1 ? "disabled" : ""} ${o ? "has-submenu" : ""}" data-has-submenu="${o}">
          <span class="menu-item-label">${t.label}</span>
          ${o ? '<span class="menu-item-arrow">▶</span>' : ""}
          ${o ? `<div class="submenu">${this.renderMenuItems(t.items)}</div>` : ""}
        </div>
      `;
    }).join("");
  }
  /**
   * Create and show the popover menu
   */
  createAndShowPopover() {
    const e = document.createElement("div");
    return e.className = "custom-popover-menu", e.innerHTML = `
      <style>
        .custom-popover-menu {
          position: fixed;
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          z-index: 10000;
        }

        .menu-item {
          padding: 10px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background-color 0.2s;
          position: relative;
          font-size: 14px;
          color: #333;
        }

        .menu-item:hover {
          background: #f5f5f5;
        }

        .menu-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .menu-item.has-submenu:hover .submenu {
          display: block;
        }

        .menu-item-label {
          flex: 1;
        }

        .menu-item-arrow {
          margin-left: 12px;
          font-size: 10px;
          color: #666;
        }

        .menu-separator {
          height: 1px;
          background: #e0e0e0;
          margin: 4px 8px;
        }

        .submenu {
          display: none;
          position: fixed;
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          z-index: 10001;
        }
      </style>
      ${this.renderMenuItems(this.menuItems)}
    `, e;
  }
  /**
   * Attach event listeners to menu items
   */
  attachMenuListeners(e, t) {
    e.querySelectorAll(".menu-item:not(.has-submenu)").forEach((r, a) => {
      let l = 0;
      const s = ((u) => {
        for (const c of u)
          if (c.label !== "---sep" && !(c.items && c.items.length > 0)) {
            if (l === a) return c;
            l++;
          }
        return null;
      })(t);
      s && s.onclick && r.addEventListener("click", (u) => {
        u.stopPropagation(), s.onclick(), this.hideMenu();
      });
    });
    const n = this.getBoundingClientRect();
    e.querySelectorAll(".menu-item.has-submenu").forEach((r) => {
      r.addEventListener("mouseenter", () => {
        const a = r.querySelector(".submenu");
        if (a) {
          const l = r.getBoundingClientRect(), p = a.getBoundingClientRect();
          let s = l.right + 5, u = l.top;
          s + p.width > n.right && (s = l.left - p.width - 5, s < n.left && (s = n.left)), u + p.height > n.bottom && (u = n.bottom - p.height, u < n.top && (u = n.top)), a.style.left = `${s}px`, a.style.top = `${u}px`;
        }
      });
    });
  }
  /**
   * Update menu button position
   */
  updateMenuButtonPosition() {
    this.menuButton && (this.menuButton.className = `menu-button ${this.menuPosition} ${this.alwaysShowMenu ? "always-visible" : ""}`);
  }
  /**
   * Update menu button visibility
   */
  updateMenuButtonVisibility() {
    this.menuButton && (this.alwaysShowMenu ? this.menuButton.classList.add("always-visible") : this.menuButton.classList.remove("always-visible"));
  }
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.menuButton && this.menuButton.addEventListener("click", this.handleMenuButtonClick.bind(this));
    const e = this.shadowRoot.querySelector(".content-wrapper");
    e && e.addEventListener("click", this.handleContentClick.bind(this));
  }
  /**
   * Cleanup event listeners
   */
  cleanupEventListeners() {
    this.menuButton && this.menuButton.removeEventListener("click", this.handleMenuButtonClick.bind(this));
    const e = this.shadowRoot.querySelector(".content-wrapper");
    e && e.removeEventListener("click", this.handleContentClick.bind(this));
  }
  /**
   * Handle menu button click
   */
  handleMenuButtonClick(e) {
    e.stopPropagation(), this.menuButton && (this.popoverMenu ? this.hideMenu() : this.showMenu());
  }
  /**
   * Show the menu
   */
  showMenu() {
    if (!this.menuButton || this.menuItems.length === 0) return;
    this.popoverMenu && this.popoverMenu.remove(), this.popoverMenu = this.createAndShowPopover(), document.body.appendChild(this.popoverMenu);
    const e = this.menuButton.getBoundingClientRect(), t = this.getBoundingClientRect();
    this.popoverMenu.style.left = `${e.left}px`, this.popoverMenu.style.top = `${e.bottom + 4}px`, requestAnimationFrame(() => {
      const o = this.popoverMenu.getBoundingClientRect();
      let n = e.left, i = e.bottom + 4;
      n + o.width > t.right && (n = t.right - o.width, n < t.left && (n = t.left)), n < t.left && (n = t.left), i + o.height > t.bottom && (i = e.top - o.height - 4, i < t.top && (i = t.top)), i < t.top && (i = t.top), this.popoverMenu.style.left = `${n}px`, this.popoverMenu.style.top = `${i}px`;
    }), this.attachMenuListeners(this.popoverMenu, this.menuItems), setTimeout(() => {
      document.addEventListener("click", this.handleDocumentClick.bind(this), { once: !0 });
    }, 0);
  }
  /**
   * Hide the menu
   */
  hideMenu() {
    this.popoverMenu && (this.popoverMenu.remove(), this.popoverMenu = null);
  }
  /**
   * Handle document click to close menu
   */
  handleDocumentClick(e) {
    const t = e.target, o = this.popoverMenu;
    o && !o.contains(t) && !this.menuButton?.contains(t) && this.hideMenu();
  }
  /**
   * Handle content click - pass through to slotted elements
   */
  handleContentClick(e) {
    const t = this.shadowRoot.querySelector("slot");
    !t || t.assignedElements().length === 0 || e.stopPropagation();
  }
}
const d = (h = "liwe3-container-box") => {
  typeof window < "u" && !window.customElements.get(h) && customElements.define(h, m);
};
d();
export {
  m as ContainerBoxElement,
  d as defineContainerBox
};
//# sourceMappingURL=ContainerBox.js.map
