class f extends HTMLElement {
  constructor() {
    super(), this.state = {
      width: 200,
      height: 150,
      minWidth: 50,
      minHeight: 50,
      aspectRatio: null,
      contentElement: null,
      contentLeft: 0,
      contentTop: 0,
      rotation: 0,
      wrapperLeft: 0,
      wrapperTop: 0
    }, this.isDragging = !1, this.dragAction = null, this.dragHandle = null, this.dragStartX = 0, this.dragStartY = 0, this.dragStartWidth = 0, this.dragStartHeight = 0, this.dragStartContentLeft = 0, this.dragStartContentTop = 0, this.dragStartContentWidth = 0, this.dragStartContentHeight = 0, this.initialContentWidth = 0, this.initialContentHeight = 0, this._dragStartRotation = 0, this._dragStartPointerAngle = 0, this._dragRotateCenterX = 0, this._dragRotateCenterY = 0, this._interactionMode = "transform", this._dragPointerOffsetX = 0, this._dragPointerOffsetY = 0, this._dragMoveContainer = null, this.handleWrapperDoubleClick = (t) => {
      this.disabled || (t.preventDefault(), t.stopPropagation(), this._setInteractionMode("crop"));
    }, this.handleDocumentPointerDown = (t) => {
      this._interactionMode !== "crop" || t.composedPath().includes(this) || this._setInteractionMode("transform");
    }, this.handleWrapperPointerDown = (t) => {
      if (this.disabled || !this.allowDrag || this._interactionMode !== "transform" || t.target.closest("[data-action]")) return;
      t.preventDefault(), t.stopPropagation();
      const n = this._getContainerForMove();
      this._dragMoveContainer = n, this._ensureAbsolutePositionForMove(n), this._syncWrapperPositionFromLayout(n);
      const i = this.getBoundingClientRect();
      this._dragPointerOffsetX = t.clientX - i.left, this._dragPointerOffsetY = t.clientY - i.top, this.isDragging = !0, this.dragAction = "move", this.dragHandle = null, this.dragStartX = t.clientX, this.dragStartY = t.clientY, document.addEventListener("pointermove", this.handlePointerMove), document.addEventListener("pointerup", this.handlePointerUp), this.dispatchEvent(new CustomEvent("rcw:move-start", { detail: { action: "move" } }));
    }, this.handlePointerDown = (t) => {
      if (this.disabled) return;
      const n = t.target.closest("[data-action]");
      if (!n || (t.preventDefault(), t.stopPropagation(), this.dragAction = n.dataset.action, this.dragAction === "crop" && this._interactionMode !== "crop") || this.dragAction === "rotate" && !this.allowRotate) return;
      if (this.isDragging = !0, this.dragHandle = n.dataset.corner || n.dataset.side || null, this.dragStartX = t.clientX, this.dragStartY = t.clientY, this.dragStartWidth = this.state.width, this.dragStartHeight = this.state.height, this.dragStartContentLeft = this.state.contentLeft, this.dragStartContentTop = this.state.contentTop, this.state.contentElement && (this.dragStartContentWidth = this.state.contentElement.offsetWidth, this.dragStartContentHeight = this.state.contentElement.offsetHeight), this.dragAction === "rotate") {
        const s = this.wrapper.getBoundingClientRect();
        this._dragRotateCenterX = s.left + s.width / 2, this._dragRotateCenterY = s.top + s.height / 2, this._dragStartPointerAngle = Math.atan2(t.clientY - this._dragRotateCenterY, t.clientX - this._dragRotateCenterX), this._dragStartRotation = this.state.rotation;
      }
      document.addEventListener("pointermove", this.handlePointerMove), document.addEventListener("pointerup", this.handlePointerUp);
      const i = this.dragAction === "scale" ? "rcw:scale-start" : this.dragAction === "crop" ? "rcw:crop-start" : "rcw:rotate-start";
      this.dispatchEvent(
        new CustomEvent(i, {
          detail: { action: this.dragAction, handle: this.dragHandle }
        })
      );
    }, this.handleContentPointerDown = (t) => {
      this.disabled || this._interactionMode !== "crop" || !this.state.contentElement || !(this.state.contentElement.offsetWidth > this.state.width || this.state.contentElement.offsetHeight > this.state.height) || (t.preventDefault(), t.stopPropagation(), this.isDragging = !0, this.dragAction = "pan", this.dragHandle = null, this.dragStartX = t.clientX, this.dragStartY = t.clientY, this.dragStartContentLeft = this.state.contentLeft, this.dragStartContentTop = this.state.contentTop, document.addEventListener("pointermove", this.handlePointerMove), document.addEventListener("pointerup", this.handlePointerUp), this.dispatchEvent(
        new CustomEvent("rcw:pan-start", {
          detail: { action: "pan" }
        })
      ));
    }, this.handlePointerMove = (t) => {
      if (!this.isDragging) return;
      if (this.dragAction === "move") {
        const i = this._dragMoveContainer || this._getContainerForMove(), s = i.getBoundingClientRect(), a = s.left + i.clientLeft, o = s.top + i.clientTop;
        this.state.wrapperLeft = t.clientX - a + i.scrollLeft - this._dragPointerOffsetX, this.state.wrapperTop = t.clientY - o + i.scrollTop - this._dragPointerOffsetY, this.style.left = `${this.state.wrapperLeft}px`, this.style.top = `${this.state.wrapperTop}px`, this.dispatchChange("move");
        return;
      }
      if (this.dragAction === "rotate") {
        this.handleRotate(t.clientX, t.clientY), this.dispatchChange("rotate");
        return;
      }
      const e = t.clientX - this.dragStartX, n = t.clientY - this.dragStartY;
      this.dragAction === "scale" ? this.handleScale(e, n, this.dragHandle) : this.dragAction === "crop" ? this.handleCrop(e, n, this.dragHandle) : this.dragAction === "pan" && this.handlePan(e, n), this.dispatchChange(this.dragAction);
    }, this.handlePointerUp = () => {
      this.isDragging && (this.isDragging = !1, document.removeEventListener("pointermove", this.handlePointerMove), document.removeEventListener("pointerup", this.handlePointerUp), this.dragAction && this.dispatchChange(this.dragAction), this.dragAction = null, this.dragHandle = null, this._dragMoveContainer = null);
    }, this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["width", "height", "min-width", "min-height", "aspect-ratio", "disabled", "allow-crop", "allow-resize", "allow-rotate", "allow-drag"];
  }
  attributeChangedCallback(t, e, n) {
    if (e !== n)
      switch (t) {
        case "width":
          this.state.width = parseFloat(n || "200"), this.updateWrapperDimensions();
          break;
        case "height":
          this.state.height = parseFloat(n || "150"), this.updateWrapperDimensions();
          break;
        case "min-width":
          this.state.minWidth = parseFloat(n || "50");
          break;
        case "min-height":
          this.state.minHeight = parseFloat(n || "50");
          break;
        case "aspect-ratio":
          this.state.aspectRatio = n;
          break;
        case "allow-crop":
        case "allow-resize":
        case "allow-rotate":
        case "allow-drag":
          this.updateHandlesVisibility(), this._applyInteractionModeUI();
          break;
      }
  }
  connectedCallback() {
    this.wrapper = this.shadowRoot.querySelector("#wrapper"), this.shadowRoot.querySelector("#clipper"), this.contentSlot = this.shadowRoot.querySelector("slot"), this.handlesContainer = this.shadowRoot.querySelector("#handles-container"), this.updateWrapperDimensions(), this.updateHandlesVisibility(), this._applyInteractionModeUI(), this._syncWrapperPositionFromLayout(this._getContainerForMove()), this.bindEvents(), this.contentSlot.addEventListener("slotchange", () => {
      this.updateContentElement();
    }), this.updateContentElement();
  }
  disconnectedCallback() {
    this.unbindEvents();
  }
  _applyInteractionModeUI() {
    this.wrapper && (this.wrapper.style.cursor = this._interactionMode === "transform" && this.allowDrag && !this.disabled ? "move" : "");
  }
  _setInteractionMode(t) {
    this._interactionMode !== t && (this._interactionMode = t, this.updateHandlesVisibility(), this._applyInteractionModeUI());
  }
  updateContentElement() {
    const t = this.contentSlot.assignedElements();
    t.length > 0 && (this.state.contentElement = t[0], this.state.contentElement.style.position = "absolute", this.state.contentElement.style.left = `${this.state.contentLeft}px`, this.state.contentElement.style.top = `${this.state.contentTop}px`, this.state.contentElement instanceof HTMLImageElement && (this.state.contentElement.complete ? this.initializeContentSize() : this.state.contentElement.addEventListener("load", () => {
      this.initializeContentSize();
    }, { once: !0 })));
  }
  initializeContentSize() {
    if (!this.state.contentElement) return;
    const t = this.state.contentElement.offsetWidth, e = this.state.contentElement.offsetHeight;
    t > 0 && (this.state.contentElement.style.width = `${t}px`, this.state.contentElement.style.height = "auto", this.initialContentWidth = t, this.initialContentHeight = e);
  }
  updateWrapperDimensions() {
    this.wrapper && (this.wrapper.style.width = `${this.state.width}px`, this.wrapper.style.height = `${this.state.height}px`, this._applyWrapperTransform());
  }
  _applyWrapperTransform() {
    this.wrapper && (this.wrapper.style.transformOrigin = "center center", this.wrapper.style.transform = `rotate(${this.state.rotation}deg)`);
  }
  updateHandlesVisibility() {
    if (!this.handlesContainer) return;
    const t = this.handlesContainer.querySelector('[data-action="scale"]'), e = this.handlesContainer.querySelector('[data-action="rotate"]'), n = this.handlesContainer.querySelectorAll('[data-action="crop"]');
    t && (t.style.display = this.allowResize ? "" : "none"), e && (e.style.display = this.allowRotate ? "" : "none"), n.forEach((i) => {
      i.style.display = this.allowCrop && this._interactionMode === "crop" ? "" : "none";
    });
  }
  bindEvents() {
    this.handlesContainer.addEventListener("pointerdown", this.handlePointerDown), this.wrapper.addEventListener("pointerdown", this.handleWrapperPointerDown), this.wrapper.addEventListener("dblclick", this.handleWrapperDoubleClick), document.addEventListener("pointerdown", this.handleDocumentPointerDown, !0), this.contentSlot.addEventListener("slotchange", () => {
      const t = this.contentSlot.assignedElements();
      t.length > 0 && t[0].addEventListener("pointerdown", this.handleContentPointerDown);
    });
  }
  unbindEvents() {
    this.handlesContainer.removeEventListener("pointerdown", this.handlePointerDown), this.wrapper.removeEventListener("pointerdown", this.handleWrapperPointerDown), this.wrapper.removeEventListener("dblclick", this.handleWrapperDoubleClick), document.removeEventListener("pointerdown", this.handleDocumentPointerDown, !0);
    const t = this.contentSlot.assignedElements();
    t.length > 0 && t[0].removeEventListener("pointerdown", this.handleContentPointerDown);
  }
  _getContainerForMove() {
    return this.parentElement || this.offsetParent || document.body;
  }
  _ensureContainerPositionedForMove(t) {
    window.getComputedStyle(t).position === "static" && (t.style.position = "relative");
  }
  _syncWrapperPositionFromLayout(t) {
    const e = t.getBoundingClientRect(), n = this.getBoundingClientRect(), i = t.scrollLeft, s = t.scrollTop, a = e.left + t.clientLeft, o = e.top + t.clientTop;
    this.state.wrapperLeft = n.left - a + i, this.state.wrapperTop = n.top - o + s;
  }
  _ensureAbsolutePositionForMove(t) {
    this._ensureContainerPositionedForMove(t), this._syncWrapperPositionFromLayout(t), this.style.position = "absolute", this.style.left = `${this.state.wrapperLeft}px`, this.style.top = `${this.state.wrapperTop}px`, this.style.touchAction = "none";
  }
  handleRotate(t, e) {
    const s = (Math.atan2(e - this._dragRotateCenterY, t - this._dragRotateCenterX) - this._dragStartPointerAngle) * (180 / Math.PI);
    this.state.rotation = this._dragStartRotation + s, this._applyWrapperTransform();
  }
  handleScale(t, e, n) {
    if (!this.state.contentElement) return;
    let i = this.dragStartWidth, s = this.dragStartHeight;
    switch (n) {
      case "br":
        i = this.dragStartWidth + t, s = this.dragStartHeight + e;
        break;
      case "bl":
        i = this.dragStartWidth - t, s = this.dragStartHeight + e;
        break;
      case "tr":
        i = this.dragStartWidth + t, s = this.dragStartHeight - e;
        break;
      case "tl":
        i = this.dragStartWidth - t, s = this.dragStartHeight - e;
        break;
    }
    if (i = Math.max(this.state.minWidth, i), s = Math.max(this.state.minHeight, s), this.state.aspectRatio) {
      const l = this.parseAspectRatio(this.state.aspectRatio);
      if (l) {
        const c = i / l, g = s * l;
        Math.abs(i - this.dragStartWidth) > Math.abs(s - this.dragStartHeight) ? s = c : i = g, i = Math.max(this.state.minWidth, i), s = Math.max(this.state.minHeight, s);
      }
    }
    const a = i / this.dragStartWidth, o = s / this.dragStartHeight, r = Math.min(a, o);
    this.state.width = i, this.state.height = s, this.updateWrapperDimensions();
    const d = this.dragStartContentWidth * r, p = this.dragStartContentHeight * r;
    this.state.contentElement.style.width = `${d}px`, this.state.contentElement.style.height = `${p}px`, this.state.contentLeft = this.dragStartContentLeft * r, this.state.contentTop = this.dragStartContentTop * r, this.clampContentPosition();
  }
  handleCrop(t, e, n) {
    let i = this.dragStartWidth, s = this.dragStartHeight;
    switch (n) {
      case "l":
        i = this.dragStartWidth - t;
        break;
      case "r":
        i = this.dragStartWidth + t;
        break;
      case "t":
        s = this.dragStartHeight - e;
        break;
      case "b":
        s = this.dragStartHeight + e;
        break;
    }
    if (i = Math.max(this.state.minWidth, i), s = Math.max(this.state.minHeight, s), this.state.aspectRatio) {
      const a = this.parseAspectRatio(this.state.aspectRatio);
      if (a) {
        const o = i / a, r = s * a;
        n === "l" || n === "r" ? s = o : i = r, i = Math.max(this.state.minWidth, i), s = Math.max(this.state.minHeight, s);
      }
    }
    if (this.state.width = i, this.state.height = s, this.updateWrapperDimensions(), n === "l") {
      const a = i - this.dragStartWidth;
      this.state.contentLeft = this.dragStartContentLeft - a;
    } else if (n === "t") {
      const a = s - this.dragStartHeight;
      this.state.contentTop = this.dragStartContentTop - a;
    }
    this.clampContentPosition();
  }
  clampContentPosition() {
    if (!this.state.contentElement) return;
    const t = this.state.contentElement.offsetWidth, e = this.state.contentElement.offsetHeight, n = Math.min(0, this.state.width - t), i = Math.min(0, this.state.height - e);
    this.state.contentLeft = Math.max(n, Math.min(0, this.state.contentLeft)), this.state.contentTop = Math.max(i, Math.min(0, this.state.contentTop)), this.state.contentElement.style.left = `${this.state.contentLeft}px`, this.state.contentElement.style.top = `${this.state.contentTop}px`;
  }
  handlePan(t, e) {
    this.state.contentElement && (this.state.contentLeft = this.dragStartContentLeft + t, this.state.contentTop = this.dragStartContentTop + e, this.clampContentPosition());
  }
  parseAspectRatio(t) {
    const e = t.split("/");
    if (e.length === 2) {
      const n = parseFloat(e[0]), i = parseFloat(e[1]);
      if (!isNaN(n) && !isNaN(i) && i !== 0)
        return n / i;
    }
    return null;
  }
  dispatchChange(t) {
    const e = {
      width: this.state.width,
      height: this.state.height,
      wrapperLeft: this.state.wrapperLeft,
      wrapperTop: this.state.wrapperTop,
      contentLeft: this.state.contentLeft,
      contentTop: this.state.contentTop,
      action: t,
      rotation: this.state.rotation,
      handle: this.dragHandle || void 0
    };
    this.dispatchEvent(new CustomEvent("rcw:change", { detail: e })), this.dispatchOnChange();
  }
  dispatchOnChange() {
    const t = this.getValues();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: t,
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
					position: relative;
				}

				#wrapper {
					position: relative;
					border: 2px solid #007bff;
					box-sizing: border-box;
					background: rgba(0, 123, 255, 0.05);
				}

				#clipper {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					overflow: hidden;
				}

				::slotted(*) {
					position: absolute;
					max-width: none;
					max-height: none;
					cursor: grab;
				}

				::slotted(*:active) {
					cursor: grabbing;
				}

				#handles-container {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					pointer-events: none;
				}

				.handle {
					position: absolute;
					background: white;
					border: 2px solid #007bff;
					pointer-events: auto;
					touch-action: none;
					z-index: 1000;
				}

				.handle.rotate {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					top: -18px;
					left: 50%;
					transform: translateX(-50%);
					cursor: grab;
				}

				.handle.rotate:active {
					cursor: grabbing;
				}

				.handle.scale {
					width: 12px;
					height: 12px;
					border-radius: 50%;
					cursor: nwse-resize;
				}

				.handle.scale.tl {
					top: -6px;
					left: -6px;
					cursor: nwse-resize;
				}

				.handle.scale.tr {
					top: -6px;
					right: -6px;
					cursor: nesw-resize;
				}

				.handle.scale.bl {
					bottom: -6px;
					left: -6px;
					cursor: nesw-resize;
				}

				.handle.scale.br {
					bottom: -6px;
					right: -6px;
					cursor: nwse-resize;
				}

				.handle.crop {
					background: #007bff;
					cursor: move;
				}

				.handle.crop.t {
					top: -2px;
					left: 50%;
					transform: translateX(-50%);
					width: 40px;
					height: 4px;
					cursor: ns-resize;
				}

				.handle.crop.b {
					bottom: -2px;
					left: 50%;
					transform: translateX(-50%);
					width: 40px;
					height: 4px;
					cursor: ns-resize;
				}

				.handle.crop.l {
					left: -2px;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 40px;
					cursor: ew-resize;
				}

				.handle.crop.r {
					right: -2px;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 40px;
					cursor: ew-resize;
				}

				:host([disabled]) #wrapper {
					opacity: 0.6;
					cursor: not-allowed;
				}

				:host([disabled]) .handle {
					display: none;
				}
			</style>

			<div id="wrapper">
				<div id="clipper">
					<slot></slot>
				</div>

				<div id="handles-container">
					<!-- Rotate handle (top-center) -->
					<div class="handle rotate" data-action="rotate"></div>

					<!-- Scale handle (only bottom-right corner) -->
					<div class="handle scale br" data-action="scale" data-corner="br"></div>

					<!-- Crop handles (only right and bottom) -->
					<div class="handle crop b" data-action="crop" data-side="b"></div>
					<div class="handle crop r" data-action="crop" data-side="r"></div>
				</div>
			</div>
		`;
  }
  // Public API - Getters and Setters
  get width() {
    return this.state.width;
  }
  set width(t) {
    this.setAttribute("width", String(t));
  }
  get height() {
    return this.state.height;
  }
  set height(t) {
    this.setAttribute("height", String(t));
  }
  get minWidth() {
    return this.state.minWidth;
  }
  set minWidth(t) {
    this.setAttribute("min-width", String(t));
  }
  get minHeight() {
    return this.state.minHeight;
  }
  set minHeight(t) {
    this.setAttribute("min-height", String(t));
  }
  get aspectRatio() {
    return this.state.aspectRatio;
  }
  set aspectRatio(t) {
    t ? this.setAttribute("aspect-ratio", t) : this.removeAttribute("aspect-ratio");
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(t) {
    t ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  get allowCrop() {
    return this.hasAttribute("allow-crop") ? this.getAttribute("allow-crop") !== "false" : !0;
  }
  set allowCrop(t) {
    t ? this.setAttribute("allow-crop", "true") : this.setAttribute("allow-crop", "false");
  }
  get allowResize() {
    return this.hasAttribute("allow-resize") ? this.getAttribute("allow-resize") !== "false" : !0;
  }
  set allowResize(t) {
    t ? this.setAttribute("allow-resize", "true") : this.setAttribute("allow-resize", "false");
  }
  get allowRotate() {
    return this.hasAttribute("allow-rotate") ? this.getAttribute("allow-rotate") !== "false" : !0;
  }
  set allowRotate(t) {
    t ? this.setAttribute("allow-rotate", "true") : this.setAttribute("allow-rotate", "false");
  }
  get allowDrag() {
    return this.hasAttribute("allow-drag") ? this.getAttribute("allow-drag") !== "false" : !0;
  }
  set allowDrag(t) {
    t ? this.setAttribute("allow-drag", "true") : this.setAttribute("allow-drag", "false");
  }
  /**
   * Gets the current values including wrapper size, content size, position, and zoom level
   */
  getValues() {
    this._syncWrapperPositionFromLayout(this._getContainerForMove());
    const t = this.state.contentElement?.offsetWidth || 0, e = this.state.contentElement?.offsetHeight || 0, n = this.initialContentWidth > 0 ? t / this.initialContentWidth : 1;
    return {
      wrapperWidth: this.state.width,
      wrapperHeight: this.state.height,
      wrapperLeft: this.state.wrapperLeft,
      wrapperTop: this.state.wrapperTop,
      contentWidth: t,
      contentHeight: e,
      contentLeft: this.state.contentLeft,
      contentTop: this.state.contentTop,
      zoom: n,
      rotation: this.state.rotation
    };
  }
  /**
   * Sets the values to reproduce size, zoom and pan
   * @param values - The values to set
   */
  setValues(t) {
    if (t.wrapperWidth !== void 0 && (this.state.width = t.wrapperWidth), t.wrapperHeight !== void 0 && (this.state.height = t.wrapperHeight), this.updateWrapperDimensions(), t.wrapperLeft !== void 0 || t.wrapperTop !== void 0) {
      const e = this._getContainerForMove();
      this._ensureAbsolutePositionForMove(e), t.wrapperLeft !== void 0 && (this.state.wrapperLeft = t.wrapperLeft), t.wrapperTop !== void 0 && (this.state.wrapperTop = t.wrapperTop), this.style.left = `${this.state.wrapperLeft}px`, this.style.top = `${this.state.wrapperTop}px`;
    }
    if (t.rotation !== void 0 && (this.state.rotation = t.rotation, this._applyWrapperTransform()), !this.state.contentElement) {
      this.dispatchOnChange();
      return;
    }
    if (t.zoom !== void 0 && this.initialContentWidth > 0) {
      const e = this.initialContentWidth * t.zoom, n = this.initialContentHeight * t.zoom;
      this.state.contentElement.style.width = `${e}px`, this.state.contentElement.style.height = `${n}px`;
    } else t.contentWidth !== void 0 && (this.state.contentElement.style.width = `${t.contentWidth}px`, t.contentHeight !== void 0 ? this.state.contentElement.style.height = `${t.contentHeight}px` : this.state.contentElement.style.height = "auto");
    t.contentLeft !== void 0 && (this.state.contentLeft = t.contentLeft), t.contentTop !== void 0 && (this.state.contentTop = t.contentTop), this.clampContentPosition(), this.dispatchOnChange();
  }
  /**
   * Gets a serializable state snapshot of the component including flags, constraints, mode,
   * and the current transform/crop values.
   */
  getState() {
    return {
      mode: this._interactionMode,
      disabled: this.disabled,
      allowCrop: this.allowCrop,
      allowResize: this.allowResize,
      allowRotate: this.allowRotate,
      allowDrag: this.allowDrag,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      aspectRatio: this.aspectRatio,
      values: this.getValues()
    };
  }
  /**
   * Restores a state snapshot produced by getState().
   * @param state - State to restore
   */
  setState(t) {
    t.disabled !== void 0 && (this.disabled = t.disabled), t.allowCrop !== void 0 && (this.allowCrop = t.allowCrop), t.allowResize !== void 0 && (this.allowResize = t.allowResize), t.allowRotate !== void 0 && (this.allowRotate = t.allowRotate), t.allowDrag !== void 0 && (this.allowDrag = t.allowDrag), t.minWidth !== void 0 && (this.minWidth = t.minWidth), t.minHeight !== void 0 && (this.minHeight = t.minHeight), t.aspectRatio !== void 0 && (this.aspectRatio = t.aspectRatio), t.mode !== void 0 && this._setInteractionMode(t.mode), t.values && this.setValues(t.values);
  }
}
const w = (h = "liwe3-resizable-cropper") => {
  typeof window < "u" && !window.customElements.get(h) && customElements.define(h, f);
};
w();
export {
  f as ResizableCropperElement,
  w as defineResizableCropper
};
//# sourceMappingURL=ResizableCropper.js.map
