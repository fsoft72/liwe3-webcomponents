var D = /* @__PURE__ */ ((g) => (g.TALK = "talk", g.CLOUD = "cloud", g.WHISPER = "whisper", g.RECTANGLE = "rectangle", g))(D || {});
class T extends HTMLElement {
  constructor() {
    super(), this._type = "talk", this._handlerPosition = { x: 50, y: 100 }, this.isDragging = !1, this.isResizing = !1, this.dragStartOffset = { x: 0, y: 0 }, this.resizeStartPos = { x: 0, y: 0 }, this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["type", "text"];
  }
  connectedCallback() {
    this.render(), this.setupEventListeners();
  }
  disconnectedCallback() {
    this.removeEventListeners();
  }
  attributeChangedCallback(t, e, n) {
    e !== n && (t === "type" ? (this._type = n || "talk", this.updateBalloonStyle()) : t === "text" && this.contentEditableElement && (this.contentEditableElement.textContent = n));
  }
  get type() {
    return this._type;
  }
  set type(t) {
    this._type = t, this.setAttribute("type", t);
  }
  get handlerPosition() {
    return { ...this._handlerPosition };
  }
  set handlerPosition(t) {
    this._handlerPosition = { ...t }, this.updateHandlerVisual();
  }
  updateHandlerPosition(t) {
    this.handlerPosition = t;
  }
  getHTML() {
    return this.outerHTML;
  }
  render() {
    this.shadowRoot.innerHTML = `
			<style>${this.getStyles()}</style>
			<div class="comic-balloon-container">
				<svg class="balloon-svg" xmlns="http://www.w3.org/2000/svg">
					<g class="cloud-shape"></g>
				</svg>
				<div class="balloon ${this._type}">
					<div class="content" contenteditable="true" role="textbox" aria-label="Balloon text">
						${this.getAttribute("text") || "Type your text here..."}
					</div>
					<div class="resize-handle" role="button" aria-label="Resize balloon"></div>
				</div>
				<div class="handler ${this._type}" role="button" aria-label="Drag to reposition pointer"></div>
			</div>
		`, this.contentEditableElement = this.shadowRoot.querySelector(".content"), this.handler = this.shadowRoot.querySelector(".handler"), this.resizeHandle = this.shadowRoot.querySelector(".resize-handle"), this.balloon = this.shadowRoot.querySelector(".balloon"), this._type === "cloud" && this.updateCloudShape(), this.updateHandlerVisual();
  }
  getStyles() {
    return `
			:host {
				display: inline-block;
				position: relative;
				width: 300px;
				min-height: 150px;
				overflow: visible;
			}

			.comic-balloon-container {
				position: relative;
				width: 100%;
				height: 100%;
				padding: 50px;
				margin: -50px;
			}

			.balloon-svg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;
				z-index: 1;
				overflow: visible;
			}

			.balloon {
				position: relative;
				padding: 20px;
				background: white;
				border: 3px solid #000;
				min-height: 100px;
				z-index: 2;
				margin: 50px;
				width: calc(100% - 100px);
				height: calc(100% - 100px);
				box-sizing: border-box;
			}

			.balloon.talk {
				border-radius: 25px;
			}

			.balloon.cloud {
				border: none;
				background: transparent;
				position: relative;
			}
			
			.balloon.cloud .content {
				position: relative;
				z-index: 10;
			}

			.balloon.whisper {
				border-radius: 25px;
				border: 3px dashed #000;
			}

			.balloon.rectangle {
				border-radius: 5px;
			}

			.content {
				outline: none;
				min-height: 60px;
				font-family: 'Comic Sans MS', cursive, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
			}

			.content:empty:before {
				content: attr(aria-label);
				color: #999;
			}

			.handler {
				position: absolute;
				width: 20px;
				height: 20px;
				cursor: move;
				z-index: 3;
				user-select: none;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 50%;
				border: 2px solid rgba(0, 0, 0, 0.3);
			}

			.handler:hover {
				background: rgba(0, 0, 0, 0.2);
				border-color: rgba(0, 0, 0, 0.5);
			}

			.handler.dragging {
				cursor: grabbing;
				background: rgba(0, 0, 0, 0.3);
			}

			.resize-handle {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 20px;
				height: 20px;
				cursor: nwse-resize;
				z-index: 4;
				background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.5) 50%);
				border-bottom-right-radius: inherit;
			}

			.resize-handle:hover {
				background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.8) 50%);
			}

			.resize-handle.resizing {
				background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 1) 50%);
			}
		`;
  }
  updateBalloonStyle() {
    !this.balloon || !this.handler || (this.balloon.className = `balloon ${this._type}`, this.handler.className = `handler ${this._type}`, this._type === "cloud" && this.updateCloudShape(), this.updateHandlerVisual());
  }
  updateCloudShape() {
    if (!this.balloon) return;
    const t = this.shadowRoot.querySelector(".cloud-shape");
    if (!t) return;
    const e = this.balloon.getBoundingClientRect(), n = this.shadowRoot.querySelector(".comic-balloon-container")?.getBoundingClientRect();
    if (!n) return;
    const s = e.left - n.left, o = e.top - n.top, d = e.width, r = e.height;
    t.innerHTML = "";
    const l = s + d / 2, h = o + r / 2, c = 14, p = d / 2.5, b = r / 2.5;
    let u = "";
    for (let i = 0; i <= c; i++) {
      const m = i / c * Math.PI * 2 - Math.PI / 2, M = (i + 1) / c * Math.PI * 2 - Math.PI / 2, v = l + Math.cos(m) * p, w = h + Math.sin(m) * b, f = l + Math.cos(M) * p, y = h + Math.sin(M) * b, z = (v + f) / 2, L = (w + y) / 2, R = f - v, S = y - w, k = Math.sqrt(R * R + S * S), x = z - l, E = L - h, C = Math.sqrt(x * x + E * E), A = x / C, _ = E / C, P = k * 0.8, $ = z + A * P, H = L + _ * P;
      i === 0 && (u += `M ${v} ${w} `), u += `Q ${$} ${H} ${f} ${y} `;
    }
    u += "Z";
    const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
    a.setAttribute("d", u), a.setAttribute("fill", "white"), a.setAttribute("stroke", "#000"), a.setAttribute("stroke-width", "3"), a.setAttribute("stroke-linejoin", "round"), t.appendChild(a);
  }
  updateHandlerVisual() {
    if (!this.handler || !this.balloon) return;
    const t = this._handlerPosition.x, e = this._handlerPosition.y;
    this.handler.style.left = `${t - 10}px`, this.handler.style.top = `${e - 10}px`, this._type === "cloud" && this.updateCloudShape(), this.updateSVGPointer();
  }
  updateSVGPointer() {
    const t = this.shadowRoot.querySelector(".balloon-svg");
    if (!t || !this.balloon) return;
    const e = this.balloon.getBoundingClientRect(), n = t.getBoundingClientRect();
    let s = t.querySelector(".pointer-group");
    s || (s = document.createElementNS("http://www.w3.org/2000/svg", "g"), s.setAttribute("class", "pointer-group"), t.appendChild(s)), s.innerHTML = "";
    const o = e.left - n.left, d = e.top - n.top, r = o + e.width / 2, l = d + e.height / 2, h = this._handlerPosition.x, c = this._handlerPosition.y, p = Math.atan2(c - l, h - r), b = e.width / 2, u = e.height / 2, a = r + Math.cos(p) * b * 0.85, i = l + Math.sin(p) * u * 0.85;
    this._type === "talk" || this._type === "rectangle" ? this.drawTalkPointer(s, a, i, h, c) : this._type === "cloud" ? this.drawCloudPointer(s, a, i, h, c) : this._type === "whisper" && this.drawWhisperPointer(s, a, i, h, c);
  }
  drawTalkPointer(t, e, n, s, o) {
    const r = Math.atan2(o - n, s - e) + Math.PI / 2, l = 20, h = e + Math.cos(r) * l / 2, c = n + Math.sin(r) * l / 2, p = e - Math.cos(r) * l / 2, b = n - Math.sin(r) * l / 2, u = s, a = o, i = document.createElementNS("http://www.w3.org/2000/svg", "path"), m = `M ${h} ${c} L ${u} ${a} L ${p} ${b} Z`;
    i.setAttribute("d", m), i.setAttribute("fill", "white"), i.setAttribute("stroke", "#000"), i.setAttribute("stroke-width", "3"), i.setAttribute("stroke-linejoin", "round"), t.appendChild(i);
  }
  drawCloudPointer(t, e, n, s, o) {
    const d = s - e, r = o - n, l = 3;
    for (let h = 0; h < l; h++) {
      const c = (h + 1) / (l + 1), p = e + d * c, b = n + r * c, u = 8 - h * 2, a = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      a.setAttribute("cx", p.toString()), a.setAttribute("cy", b.toString()), a.setAttribute("r", u.toString()), a.setAttribute("fill", "white"), a.setAttribute("stroke", "#000"), a.setAttribute("stroke-width", "2"), t.appendChild(a);
    }
  }
  drawWhisperPointer(t, e, n, s, o) {
    const r = Math.atan2(o - n, s - e) + Math.PI / 2, l = 20, h = e + Math.cos(r) * l / 2, c = n + Math.sin(r) * l / 2, p = e - Math.cos(r) * l / 2, b = n - Math.sin(r) * l / 2, u = s, a = o, i = document.createElementNS("http://www.w3.org/2000/svg", "path"), m = `M ${h} ${c} L ${u} ${a} L ${p} ${b}`;
    i.setAttribute("d", m), i.setAttribute("fill", "none"), i.setAttribute("stroke", "#000"), i.setAttribute("stroke-width", "3"), i.setAttribute("stroke-dasharray", "10 5"), i.setAttribute("stroke-linejoin", "round"), i.setAttribute("stroke-linecap", "round"), t.appendChild(i);
  }
  setupEventListeners() {
    this.handler && (this.handler.addEventListener("mousedown", this.handleMouseDown.bind(this)), this.handler.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: !1 }), this.resizeHandle && (this.resizeHandle.addEventListener("mousedown", this.handleResizeMouseDown.bind(this)), this.resizeHandle.addEventListener("touchstart", this.handleResizeTouchStart.bind(this), { passive: !1 })), this.contentEditableElement && this.contentEditableElement.addEventListener("blur", this.handleContentBlur.bind(this)));
  }
  removeEventListeners() {
    this.handler && (this.handler.removeEventListener("mousedown", this.handleMouseDown.bind(this)), this.handler.removeEventListener("touchstart", this.handleTouchStart.bind(this)), this.resizeHandle && (this.resizeHandle.removeEventListener("mousedown", this.handleResizeMouseDown.bind(this)), this.resizeHandle.removeEventListener("touchstart", this.handleResizeTouchStart.bind(this))), this.contentEditableElement && this.contentEditableElement.removeEventListener("blur", this.handleContentBlur.bind(this)));
  }
  handleMouseDown(t) {
    t.preventDefault(), this.startDrag(t.clientX, t.clientY);
    const e = (s) => this.handleDrag(s.clientX, s.clientY), n = () => {
      this.stopDrag(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", n);
    };
    document.addEventListener("mousemove", e), document.addEventListener("mouseup", n);
  }
  handleTouchStart(t) {
    t.preventDefault();
    const e = t.touches[0];
    this.startDrag(e.clientX, e.clientY);
    const n = (o) => {
      const d = o.touches[0];
      this.handleDrag(d.clientX, d.clientY);
    }, s = () => {
      this.stopDrag(), document.removeEventListener("touchmove", n), document.removeEventListener("touchend", s);
    };
    document.addEventListener("touchmove", n, { passive: !1 }), document.addEventListener("touchend", s);
  }
  startDrag(t, e) {
    this.isDragging = !0, this.handler && this.handler.classList.add("dragging");
    const n = this.shadowRoot.querySelector(".comic-balloon-container")?.getBoundingClientRect();
    n && (this.dragStartOffset = {
      x: t - n.left - this._handlerPosition.x,
      y: e - n.top - this._handlerPosition.y
    });
  }
  handleDrag(t, e) {
    if (!this.isDragging) return;
    const n = this.shadowRoot.querySelector(".comic-balloon-container")?.getBoundingClientRect();
    if (!n) return;
    let s = t - n.left - this.dragStartOffset.x, o = e - n.top - this.dragStartOffset.y;
    s = Math.max(-50, Math.min(n.width + 50, s)), o = Math.max(-50, Math.min(n.height + 50, o)), this._handlerPosition = { x: s, y: o }, this.updateHandlerVisual();
  }
  stopDrag() {
    this.isDragging = !1, this.handler && this.handler.classList.remove("dragging"), this.dispatchEvent(new CustomEvent("handler-move", {
      detail: {
        finalPosition: { ...this._handlerPosition },
        balloonType: this._type
      },
      bubbles: !0,
      composed: !0
    }));
  }
  handleContentBlur() {
    this.contentEditableElement && this.dispatchEvent(new CustomEvent("balloon-content-change", {
      detail: {
        newContent: this.contentEditableElement.textContent || "",
        balloonType: this._type
      },
      bubbles: !0,
      composed: !0
    }));
  }
  handleResizeMouseDown(t) {
    t.preventDefault(), t.stopPropagation(), this.startResize(t.clientX, t.clientY);
    const e = (s) => this.handleResize(s.clientX, s.clientY), n = () => {
      this.stopResize(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", n);
    };
    document.addEventListener("mousemove", e), document.addEventListener("mouseup", n);
  }
  handleResizeTouchStart(t) {
    t.preventDefault(), t.stopPropagation();
    const e = t.touches[0];
    this.startResize(e.clientX, e.clientY);
    const n = (o) => {
      const d = o.touches[0];
      this.handleResize(d.clientX, d.clientY);
    }, s = () => {
      this.stopResize(), document.removeEventListener("touchmove", n), document.removeEventListener("touchend", s);
    };
    document.addEventListener("touchmove", n, { passive: !1 }), document.addEventListener("touchend", s);
  }
  startResize(t, e) {
    !this.balloon || !this.resizeHandle || (this.isResizing = !0, this.resizeHandle.classList.add("resizing"), this.resizeStartPos = {
      x: t,
      y: e
    });
  }
  handleResize(t, e) {
    if (!this.isResizing) return;
    const n = t - this.resizeStartPos.x, s = e - this.resizeStartPos.y, o = this.getBoundingClientRect(), d = Math.max(150, o.width + n), r = Math.max(100, o.height + s);
    this.style.width = `${d}px`, this.style.height = `${r}px`, this.resizeStartPos = {
      x: t,
      y: e
    }, this.updateHandlerVisual();
  }
  stopResize() {
    if (!this.isResizing || !this.balloon || !this.resizeHandle) return;
    this.isResizing = !1, this.resizeHandle.classList.remove("resizing");
    const t = this.balloon.getBoundingClientRect();
    this.dispatchEvent(new CustomEvent("balloon-resize", {
      detail: {
        width: t.width,
        height: t.height,
        balloonType: this._type
      },
      bubbles: !0,
      composed: !0
    }));
  }
}
const X = () => {
  typeof window < "u" && !customElements.get("comic-balloon") && customElements.define("comic-balloon", T);
};
export {
  D as BalloonType,
  T as ComicBalloonElement,
  X as defineComicBalloon
};
//# sourceMappingURL=ComicBalloon.js.map
