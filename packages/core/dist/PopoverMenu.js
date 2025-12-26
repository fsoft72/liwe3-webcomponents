class u extends HTMLElement {
  constructor() {
    super(), this.items = [], this.openPopovers = /* @__PURE__ */ new Map(), this.hoverTimeouts = /* @__PURE__ */ new Map(), this.initialized = !1, this.globalClickHandler = null, this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.initialized || (this.render(), this.setupGlobalListeners(), this.initialized = !0);
  }
  disconnectedCallback() {
    this.cleanupGlobalListeners();
  }
  /**
   * Set up global event listeners
   */
  setupGlobalListeners() {
    this.globalClickHandler = (e) => {
      !this.contains(e.target) && !this.shadowRoot.contains(e.target) && this.closeAllMenus();
    }, document.addEventListener("click", this.globalClickHandler);
  }
  /**
   * Clean up global event listeners
   */
  cleanupGlobalListeners() {
    this.globalClickHandler && (document.removeEventListener("click", this.globalClickHandler), this.globalClickHandler = null);
  }
  /**
   * Set menu items
   */
  setItems(e) {
    this.items = e, this.render();
  }
  /**
   * Get current menu items
   */
  getItems() {
    return this.items;
  }
  /**
   * Add a new menu item
   */
  addMenuItem(e, i = null) {
    i === null ? this.items.push(e) : this.items.splice(i, 0, e), this.render();
  }
  /**
   * Remove a menu item
   */
  removeMenuItem(e) {
    e >= 0 && e < this.items.length && (this.items.splice(e, 1), this.render());
  }
  /**
   * Update a menu item
   */
  updateMenuItem(e, i) {
    e >= 0 && e < this.items.length && (this.items[e] = i, this.render());
  }
  /**
   * Render the menu component
   */
  render() {
    const e = this.shadowRoot.querySelector(".popover-menu-bar");
    e && e.remove(), this.openPopovers.clear(), this.hoverTimeouts.forEach((t) => clearTimeout(t)), this.hoverTimeouts.clear(), this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        /* PopoverMenu Component Styles */
        .popover-menu-bar {
          display: flex;
          background: var(--popover-menu-bar-background, #fff);
          border: 1px solid var(--popover-menu-bar-border, #ddd);
          border-radius: var(--popover-menu-bar-radius, 6px);
          padding: var(--popover-menu-bar-padding, 4px);
          box-shadow: var(--popover-menu-bar-shadow, 0 1px 3px rgba(0,0,0,0.1));
        }

        .popover-menu-trigger {
          background: none;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          transition: background-color 0.2s;
          font-family: inherit;
          color: var(--popover-menu-trigger-color, #333);
        }

        .popover-menu-trigger:hover {
          background: var(--popover-menu-trigger-hover-bg, #f0f0f0);
        }

        .popover-menu-trigger.active {
          background: var(--popover-menu-trigger-active-bg, #e3f2fd);
          color: var(--popover-menu-trigger-active-color, #1976d2);
        }

        .popover-menu-popover {
          margin: 0;
          padding: 4px;
          border: 1px solid var(--popover-menu-border, #ccc);
          border-radius: var(--popover-menu-radius, 6px);
          background: var(--popover-menu-background, white);
          box-shadow: var(--popover-menu-shadow, 0 4px 12px rgba(0,0,0,0.15));
          min-width: 180px;
          z-index: 1000;
          font-family: inherit;
          position: fixed;
          display: none;
        }

        .popover-menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          transition: background-color 0.2s;
          position: relative;
          color: var(--popover-menu-item-color, #333);
        }

        .popover-menu-item:hover {
          background: var(--popover-menu-item-hover-bg, #f5f5f5);
        }

        .popover-menu-item.disabled {
          color: var(--popover-menu-item-disabled-color, #999);
          cursor: not-allowed;
        }

        .popover-menu-item.disabled:hover {
          background: transparent;
        }

        .popover-menu-item.has-submenu::after {
          content: '▶';
          font-size: 10px;
          color: var(--popover-menu-submenu-arrow-color, #666);
        }

        .popover-menu-separator {
          height: 1px;
          background: var(--popover-menu-separator-color, #e0e0e0);
          margin: 4px 0;
        }

        .popover-submenu-popover {
          margin: 0;
          padding: 4px;
          border: 1px solid var(--popover-menu-border, #ccc);
          border-radius: var(--popover-menu-radius, 6px);
          background: var(--popover-menu-background, white);
          box-shadow: var(--popover-menu-shadow, 0 4px 12px rgba(0,0,0,0.15));
          min-width: 160px;
          z-index: 1001;
          font-family: inherit;
          position: fixed;
          display: none;
        }
      </style>
      <div class="popover-menu-bar"></div>
    `;
    const i = this.shadowRoot.querySelector(".popover-menu-bar");
    this.items.forEach((t, o) => {
      const r = this.createMenuTrigger(t, o);
      i.appendChild(r);
    });
  }
  /**
   * Create a menu trigger button
   */
  createMenuTrigger(e, i) {
    const t = document.createElement("button");
    return t.className = "popover-menu-trigger", t.textContent = e.label, t.dataset.menuIndex = i.toString(), t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), this.handleMenuTriggerClick(t, e.items, i);
    }), t;
  }
  /**
   * Create a popover if it doesn't exist
   */
  createPopoverIfNeeded(e, i, t = !1) {
    let o = this.shadowRoot.querySelector(`#${i}`);
    return o || (o = document.createElement("div"), o.id = i, o.className = t ? "popover-submenu-popover" : "popover-menu-popover", o.style.display = "none", o.style.position = "fixed", this.shadowRoot.appendChild(o), this.openPopovers.set(i, o)), this.populatePopover(o, e, i), o;
  }
  /**
   * Populate a popover with menu items
   */
  populatePopover(e, i, t) {
    e.innerHTML = "", i.forEach((o, r) => {
      if (o.label === "---sep") {
        const s = document.createElement("div");
        s.className = "popover-menu-separator", e.appendChild(s);
      } else {
        const s = this.createMenuItem(o, `${t}-item-${r}`);
        e.appendChild(s);
      }
    });
  }
  /**
   * Create a menu item element
   */
  createMenuItem(e, i) {
    const t = document.createElement("div");
    if (t.className = "popover-menu-item", t.textContent = e.label, e.enabled === !1)
      return t.classList.add("disabled"), t;
    if (e.items && e.items.length > 0) {
      t.classList.add("has-submenu");
      const o = `${i}-submenu`;
      let r;
      t.addEventListener("mouseenter", (s) => {
        s.stopPropagation(), this.hoverTimeouts.has(o) && clearTimeout(this.hoverTimeouts.get(o)), r = window.setTimeout(() => {
          this.closeOtherSubmenus(o), this.showSubmenu(e.items, o, t);
        }, 100), this.hoverTimeouts.set(o, r);
      }), t.addEventListener("mouseleave", (s) => {
        s.stopPropagation();
      }), t.addEventListener("click", (s) => {
        s.stopPropagation(), this.closeOtherSubmenus(o), this.showSubmenu(e.items, o, t);
      });
    } else e.onclick && t.addEventListener("click", (o) => {
      o.stopPropagation(), e.onclick(), this.closeAllMenus();
    });
    return t;
  }
  /**
   * Show a submenu
   */
  showSubmenu(e, i, t) {
    const o = this.createPopoverIfNeeded(e, i, !0);
    o.style.display = "block";
    const r = t.getBoundingClientRect();
    o.style.position = "fixed", o.style.left = `${r.right + 5}px`, o.style.top = `${r.top}px`, requestAnimationFrame(() => {
      const s = t.getBoundingClientRect();
      this.adjustPopoverPosition(o, s, "submenu");
    });
  }
  /**
   * Close other submenus except the specified one and its ancestors
   */
  closeOtherSubmenus(e = null) {
    const i = /* @__PURE__ */ new Set();
    if (e) {
      i.add(e);
      let t = e;
      for (; t.includes("-submenu"); ) {
        const o = t.lastIndexOf("-submenu");
        if (o > 0) {
          const s = t.substring(0, o).lastIndexOf("-item-");
          if (s > 0)
            t = t.substring(0, s), t.endsWith("-submenu") && i.add(t);
          else
            break;
        } else
          break;
      }
    }
    this.openPopovers.forEach((t, o) => {
      !i.has(o) && t.classList.contains("popover-submenu-popover") && (t.style.display = "none");
    });
  }
  /**
   * Close all menus
   */
  closeAllMenus() {
    this.hoverTimeouts.forEach((e) => clearTimeout(e)), this.hoverTimeouts.clear(), this.openPopovers.forEach((e) => {
      e.style.display = "none";
    }), this.shadowRoot.querySelectorAll(".popover-menu-trigger").forEach((e) => e.classList.remove("active"));
  }
  /**
   * Handle menu trigger click
   */
  handleMenuTriggerClick(e, i, t) {
    const o = `menu-${t}`, r = this.shadowRoot.querySelector(`#${o}`);
    if (r && r.style.display === "block")
      this.closeAllMenus();
    else {
      this.closeAllMenus();
      const s = this.createPopoverIfNeeded(i, o);
      e.classList.add("active"), this.showMainMenu(s, e);
    }
  }
  /**
   * Show the main menu
   */
  showMainMenu(e, i) {
    e.style.display = "block";
    const t = i.getBoundingClientRect();
    e.style.position = "fixed", e.style.left = `${t.left}px`, e.style.top = `${t.bottom + 2}px`, requestAnimationFrame(() => {
      const o = i.getBoundingClientRect();
      this.adjustPopoverPosition(e, o, "main");
    });
  }
  /**
   * Adjust popover position to handle overflow
   */
  adjustPopoverPosition(e, i, t) {
    const o = e.getBoundingClientRect(), r = window.innerWidth, s = window.innerHeight, n = 10;
    let l = parseFloat(e.style.left), a = parseFloat(e.style.top);
    t === "main" ? (o.right > r - n && (l = i.right - o.width), l < n && (l = n), o.width > r - 2 * n && (l = n), o.bottom > s - n && (a = i.top - o.height - 2, a < n && (a = s - o.height - n)), a < n && (a = n), o.height > s - 2 * n && (a = n)) : t === "submenu" && (o.right > r - n && (l = i.left - o.width - 5, l < n && (l = n)), l < n && (l = n), o.bottom > s - n && (a = i.bottom - o.height, a < n && (a = s - o.height - n)), a < n && (a = n), o.height > s - 2 * n && (a = n)), e.style.left = `${l}px`, e.style.top = `${a}px`;
  }
}
const d = (p = "liwe3-popover-menu") => {
  typeof window < "u" && !window.customElements.get(p) && customElements.define(p, u);
};
d();
export {
  u as PopoverMenuElement,
  d as definePopoverMenu
};
//# sourceMappingURL=PopoverMenu.js.map
