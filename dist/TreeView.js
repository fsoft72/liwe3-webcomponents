class h extends HTMLElement {
  constructor() {
    super(), this.treeData = [], this.selectedIds = /* @__PURE__ */ new Set(), this.expandedIds = /* @__PURE__ */ new Set(), this.indentWidth = 20, this.showBorder = !0, this.attachShadow({ mode: "open" }), this.render(), this.bindEvents();
  }
  static get observedAttributes() {
    return ["data", "indent-width", "selected-ids", "show-border"];
  }
  attributeChangedCallback(e, t, o) {
    t !== o && (e === "indent-width" && (this.indentWidth = parseInt(o || "20", 10)), e === "show-border" && (this.showBorder = o !== "false"), this.render());
  }
  get data() {
    const e = this.getAttribute("data");
    if (e)
      try {
        return JSON.parse(e);
      } catch (t) {
        return console.error("Invalid data format:", t), [];
      }
    return this.treeData;
  }
  set data(e) {
    this.treeData = e, this.initializeExpandedState(e), this.setAttribute("data", JSON.stringify(e));
  }
  get selectedNodeIds() {
    return Array.from(this.selectedIds);
  }
  set selectedNodeIds(e) {
    this.selectedIds = new Set(e), this.render();
  }
  get showBorderEnabled() {
    return this.showBorder;
  }
  set showBorderEnabled(e) {
    this.showBorder = e, this.setAttribute("show-border", e.toString()), this.render();
  }
  /**
   * Initialize expanded state from the data
   */
  initializeExpandedState(e) {
    const t = (o) => {
      o.expanded && this.expandedIds.add(o.id), o.children && o.children.forEach(t);
    };
    e.forEach(t);
  }
  /**
   * Toggle node expansion
   */
  toggleExpansion(e) {
    const t = this.shadowRoot.querySelector(`.tree-node[data-node-id="${e}"]`);
    if (!t) return;
    const o = Array.from(t.children).find(
      (r) => r.classList.contains("node-children")
    );
    if (!!o) {
      o.remove(), this.expandedIds.delete(e);
      const r = t.querySelector(".expand-icon");
      r && r.classList.remove("expanded"), this.dispatchEvent(new CustomEvent("toggle", {
        detail: { nodeId: e, expanded: !1 }
      }));
    } else {
      const r = this.findNode(e);
      if (r && r.children) {
        const d = parseInt(t.dataset.depth || "0", 10), i = `
          <div class="node-children">
            ${r.children.map((c) => this.renderNode(c, d + 1)).join("")}
          </div>
        `;
        t.insertAdjacentHTML("beforeend", i), this.expandedIds.add(e);
        const s = t.querySelector(".expand-icon");
        s && s.classList.add("expanded"), this.dispatchEvent(new CustomEvent("toggle", {
          detail: { nodeId: e, expanded: !0 }
        }));
      }
    }
  }
  /**
   * Toggle node selection
   */
  toggleSelection(e) {
    const t = this.selectedIds.has(e);
    t ? this.selectedIds.delete(e) : this.selectedIds.add(e);
    const o = this.shadowRoot.querySelector(`.node-checkbox[data-node-id="${e}"]`);
    o && (o.checked = !t), this.dispatchEvent(new CustomEvent("selectionchange", {
      detail: { selectedIds: this.selectedNodeIds }
    }));
  }
  /**
   * Select all nodes recursively
   */
  selectAll() {
    const e = (t) => {
      this.selectedIds.add(t.id), t.children && t.children.forEach(e);
    };
    this.data.forEach(e), this.render(), this.dispatchEvent(new CustomEvent("selectionchange", {
      detail: { selectedIds: this.selectedNodeIds }
    }));
  }
  /**
   * Deselect all nodes
   */
  deselectAll() {
    this.selectedIds.clear(), this.render(), this.dispatchEvent(new CustomEvent("selectionchange", {
      detail: { selectedIds: this.selectedNodeIds }
    }));
  }
  /**
   * Expand all nodes
   */
  expandAll() {
    const e = (t) => {
      t.children && t.children.length > 0 && (this.expandedIds.add(t.id), t.children.forEach(e));
    };
    this.data.forEach(e), this.render();
  }
  /**
   * Collapse all nodes
   */
  collapseAll() {
    this.expandedIds.clear(), this.render();
  }
  /**
   * Get node by ID
   */
  findNode(e, t = this.data) {
    for (const o of t) {
      if (o.id === e)
        return o;
      if (o.children) {
        const n = this.findNode(e, o.children);
        if (n) return n;
      }
    }
    return null;
  }
  /**
   * Get the default folder icon
   */
  getDefaultIcon(e, t) {
    return e.children && e.children.length > 0 ? t ? "📂" : "📁" : "📄";
  }
  /**
   * Render a single tree node
   */
  renderNode(e, t = 0) {
    const o = this.expandedIds.has(e.id), n = this.selectedIds.has(e.id), r = e.children && e.children.length > 0, d = t * this.indentWidth;
    let i = "";
    e.customIcon ? i = `<span class="node-icon custom-icon">${e.customIcon}</span>` : e.icon !== void 0 && e.icon !== "" ? i = `<span class="node-icon">${e.icon}</span>` : e.icon !== "" && (i = `<span class="node-icon">${this.getDefaultIcon(e, o)}</span>`);
    let s = "";
    return r && o && (s = `<div class="node-children">${e.children.map((l) => this.renderNode(l, t + 1)).join("")}</div>`), `
      <div class="tree-node" data-node-id="${e.id}" data-depth="${t}">
        <div class="node-content" style="padding-left: ${d}px">
          <div class="node-controls">
            ${r ? `<button class="expand-toggle" data-node-id="${e.id}" aria-label="${o ? "Collapse" : "Expand"}">
                   <svg class="expand-icon ${o ? "expanded" : ""}" viewBox="0 0 24 24" width="16" height="16">
                     <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                   </svg>
                 </button>` : '<span class="expand-spacer"></span>'}
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                class="node-checkbox"
                data-node-id="${e.id}"
                ${n ? "checked" : ""}
              >
              <span class="checkbox-custom"></span>
            </label>
          </div>
          ${i}
          <span class="node-label" data-node-id="${e.id}">${e.label}</span>
        </div>
        ${s}
      </div>
    `;
  }
  /**
   * Bind event listeners
   */
  bindEvents() {
    this.shadowRoot.addEventListener("click", (e) => {
      const t = e.target;
      if (t.closest(".expand-toggle")) {
        const n = t.closest(".expand-toggle").dataset.nodeId;
        n && this.toggleExpansion(n);
        return;
      }
    }), this.shadowRoot.addEventListener("change", (e) => {
      const t = e.target;
      if (t.classList.contains("node-checkbox")) {
        const o = t.dataset.nodeId;
        if (o) {
          this.toggleSelection(o);
          const n = this.findNode(o);
          if (n && n.children && n.children.length > 0) {
            const r = !!t.checked, d = (s) => {
              s.children && s.children.forEach(d), s.id !== o && (r ? this.selectedIds.add(s.id) : this.selectedIds.delete(s.id));
            };
            d(n);
            const i = this.shadowRoot.querySelector(`.tree-node[data-node-id="${o}"]`);
            i && i.querySelectorAll(".node-checkbox").forEach((s) => {
              s.checked = r;
            }), this.dispatchEvent(new CustomEvent("selectionchange", {
              detail: { selectedIds: this.selectedNodeIds }
            }));
          }
        }
      }
    }), this.shadowRoot.addEventListener("dblclick", (e) => {
      const t = e.target;
      if (t.closest(".checkbox-wrapper") || t.classList.contains("node-checkbox")) {
        e.stopPropagation(), e.preventDefault();
        return;
      }
      if (t.closest(".node-label") || t.closest(".node-content")) {
        const o = t.closest(".node-content");
        if (!o) return;
        const n = o.closest(".tree-node");
        if (!n) return;
        const r = n.dataset.nodeId;
        if (!r) return;
        const d = this.findNode(r);
        if (!d) return;
        d.children && d.children.length > 0 ? this.toggleExpansion(r) : this.dispatchEvent(new CustomEvent("itemselected", {
          detail: { node: d, nodeId: r }
        }));
      }
    });
  }
  /**
   * Render the component
   */
  render() {
    const e = this.showBorder ? "tree-container bordered" : "tree-container borderless";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--tree-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--tree-font-size, 14px);
          color: var(--tree-text-color, #333);
          background: var(--tree-background, transparent);
          user-select: none;
        }

        .tree-container {
          overflow: auto;
          padding: var(--tree-padding, 8px);
          border-radius: var(--tree-border-radius, 10px);
          background: var(--tree-container-background, transparent);
          border: none;
        }

        .tree-container.bordered {
          border: var(--tree-border, 1px solid rgba(15, 23, 42, 0.12));
          box-shadow: var(--tree-border-shadow, none);
        }

        .tree-container.borderless {
          border: none;
        }

        .tree-node {
          position: relative;
        }

        .node-content {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: var(--tree-node-border-radius, 6px);
          transition: background-color 0.15s ease;
          cursor: pointer;
        }

        .node-content:hover {
          background-color: var(--tree-hover-background, rgba(0, 123, 255, 0.08));
        }

        .node-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .expand-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.15s ease;
        }

        .expand-toggle:hover {
          background-color: var(--tree-expand-hover-background, rgba(0, 0, 0, 0.1));
        }

        .expand-toggle:focus {
          outline: 2px solid var(--tree-focus-color, #007bff);
          outline-offset: 2px;
        }

        .expand-icon {
          fill: var(--tree-icon-color, #666);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
        }

        .expand-spacer {
          width: 20px;
          height: 20px;
          display: inline-block;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin: 0;
        }

        .node-checkbox {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-custom {
          position: relative;
          width: 18px;
          height: 18px;
          border: 2px solid var(--tree-checkbox-border, #ccc);
          border-radius: var(--tree-checkbox-border-radius, 4px);
          background: var(--tree-checkbox-background, white);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkbox-custom::after {
          content: '';
          position: absolute;
          display: none;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .node-checkbox:checked + .checkbox-custom {
          background: var(--tree-checkbox-checked-background, #007bff);
          border-color: var(--tree-checkbox-checked-border, #007bff);
        }

        .node-checkbox:checked + .checkbox-custom::after {
          display: block;
        }

        .checkbox-wrapper:hover .checkbox-custom {
          border-color: var(--tree-checkbox-hover-border, #999);
          box-shadow: 0 0 0 3px var(--tree-checkbox-hover-shadow, rgba(0, 123, 255, 0.1));
        }

        .node-checkbox:focus + .checkbox-custom {
          outline: 2px solid var(--tree-focus-color, #007bff);
          outline-offset: 2px;
        }

        .node-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          min-width: 20px;
        }

        .node-icon.custom-icon {
          font-size: var(--tree-custom-icon-size, 20px);
        }

        .node-label {
          flex: 1;
          padding: 2px 4px;
          color: var(--tree-label-color, #333);
          font-weight: var(--tree-label-font-weight, 400);
          line-height: 1.4;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .node-label:hover {
          color: var(--tree-label-hover-color, #007bff);
        }

        .node-children {
          position: relative;
        }

        .node-children::before {
          content: '';
          position: absolute;
          left: calc(var(--tree-indent-width, 20px) / 2 + 8px);
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--tree-guide-line-color, rgba(0, 0, 0, 0.1));
        }

        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .node-children {
          animation: slideDown 0.2s ease-out;
        }

        /* Empty state */
        .tree-empty {
          padding: 32px;
          text-align: center;
          color: var(--tree-empty-color, #999);
          font-style: italic;
        }

        /* Scrollbar styling */
        .tree-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .tree-container::-webkit-scrollbar-track {
          background: var(--tree-scrollbar-track, #f1f1f1);
          border-radius: 4px;
        }

        .tree-container::-webkit-scrollbar-thumb {
          background: var(--tree-scrollbar-thumb, #888);
          border-radius: 4px;
        }

        .tree-container::-webkit-scrollbar-thumb:hover {
          background: var(--tree-scrollbar-thumb-hover, #555);
        }
      </style>

      <div class="${e}">
        ${this.data.length > 0 ? this.data.map((t) => this.renderNode(t)).join("") : '<div class="tree-empty">No items to display</div>'}
      </div>
    `;
  }
}
const p = (a = "liwe3-tree-view") => {
  typeof window < "u" && !window.customElements.get(a) && customElements.define(a, h);
};
p();
export {
  h as TreeViewElement,
  p as defineTreeView
};
//# sourceMappingURL=TreeView.js.map
