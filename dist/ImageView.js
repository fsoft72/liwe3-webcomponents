class s extends HTMLElement {
  constructor() {
    super(), this._src = "", this._width = "100%", this._height = "auto", this._mode = "cover", this._position = "center", this._fx = "none", this._fxHover = "none", this._alt = "", this._isHovering = !1, this.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = `
            :host {
                display: block;
                overflow: hidden;
                position: relative;
            }

            .container {
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: relative;
                display: flex;
            }

            img {
                display: block;
                transition: transform 0.5s ease, filter 0.5s ease;
            }

            /* Modes */
            .mode-stretch img {
                width: 100%;
                height: 100%;
                object-fit: fill;
            }

            .mode-cover img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .mode-contain img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .mode-1-1 img {
                max-width: none;
                max-height: none;
                /* Default to auto, controlled by position */
            }

            /* Positions for 1:1 and others if applicable */
            .pos-center { justify-content: center; align-items: center; }
            .pos-top { justify-content: center; align-items: flex-start; }
            .pos-bottom { justify-content: center; align-items: flex-end; }
            .pos-left { justify-content: flex-start; align-items: center; }
            .pos-right { justify-content: flex-end; align-items: center; }
            .pos-top-left { justify-content: flex-start; align-items: flex-start; }
            .pos-top-right { justify-content: flex-end; align-items: flex-start; }
            .pos-bottom-left { justify-content: flex-start; align-items: flex-end; }
            .pos-bottom-right { justify-content: flex-end; align-items: flex-end; }

            /* FX */
            .fx-bokeh img {
                filter: blur(3px);
            }

            @keyframes pan-left {
                0% { transform: scale(1.2) translateX(0); }
                100% { transform: scale(1.2) translateX(-10%); }
            }

            @keyframes pan-right {
                0% { transform: scale(1.2) translateX(0); }
                100% { transform: scale(1.2) translateX(10%); }
            }

            @keyframes zoom-in {
                0% { transform: scale(1); }
                100% { transform: scale(1.2); }
            }

            @keyframes zoom-out {
                0% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .fx-pan-left img {
                animation: pan-left 10s linear infinite alternate;
            }

            .fx-pan-right img {
                animation: pan-right 10s linear infinite alternate;
            }

            .fx-zoom-in img {
                animation: zoom-in 10s linear infinite alternate;
            }

            .fx-zoom-out img {
                animation: zoom-out 10s linear infinite alternate;
            }
        `, this.container = document.createElement("div"), this.container.classList.add("container"), this.img = document.createElement("img"), this.container.appendChild(this.img), this.shadowRoot.appendChild(t), this.shadowRoot.appendChild(this.container), this.addEventListener("mouseenter", this._handleMouseEnter.bind(this)), this.addEventListener("mouseleave", this._handleMouseLeave.bind(this));
  }
  _handleMouseEnter() {
    this._fxHover !== "none" && (this._isHovering = !0, this.updateClasses());
  }
  _handleMouseLeave() {
    this._fxHover !== "none" && (this._isHovering = !1, this.updateClasses());
  }
  static get observedAttributes() {
    return ["src", "width", "height", "mode", "position", "fx", "fx-hover", "alt"];
  }
  attributeChangedCallback(t, i, e) {
    if (i !== e)
      switch (t) {
        case "src":
          this._src = e || "", this.render();
          break;
        case "width":
          this._width = e || "100%", this.updateDimensions();
          break;
        case "height":
          this._height = e || "auto", this.updateDimensions();
          break;
        case "mode":
          this._mode = e || "cover", this.updateClasses();
          break;
        case "position":
          this._position = e || "center", this.updateClasses();
          break;
        case "fx":
          this._fx = e || "none", this.updateClasses();
          break;
        case "fx-hover":
          this._fxHover = e || "none", this.updateClasses();
          break;
        case "alt":
          this._alt = e || "", this.render();
          break;
      }
  }
  connectedCallback() {
    this.updateDimensions(), this.updateClasses(), this.render();
  }
  updateDimensions() {
    this.style.width = this._width, this.style.height = this._height;
  }
  updateClasses() {
    this.container.className = "container", this.container.classList.add(`mode-${this._mode}`), this.container.classList.add(`pos-${this._position}`);
    const t = this._isHovering && this._fxHover !== "none" ? this._fxHover : this._fx;
    this.container.classList.add(`fx-${t}`);
  }
  render() {
    this.img.getAttribute("src") !== this._src && (this._src ? this.img.setAttribute("src", this._src) : this.img.removeAttribute("src")), this.img.getAttribute("alt") !== this._alt && (this._alt ? this.img.setAttribute("alt", this._alt) : this.img.removeAttribute("alt"));
  }
  // Public API
  get src() {
    return this._src;
  }
  set src(t) {
    this.setAttribute("src", t);
  }
  get width() {
    return this._width;
  }
  set width(t) {
    this.setAttribute("width", t);
  }
  get height() {
    return this._height;
  }
  set height(t) {
    this.setAttribute("height", t);
  }
  get mode() {
    return this._mode;
  }
  set mode(t) {
    this.setAttribute("mode", t);
  }
  get position() {
    return this._position;
  }
  set position(t) {
    this.setAttribute("position", t);
  }
  get fx() {
    return this._fx;
  }
  set fx(t) {
    this.setAttribute("fx", t);
  }
  get fxHover() {
    return this._fxHover;
  }
  set fxHover(t) {
    this.setAttribute("fx-hover", t);
  }
  get alt() {
    return this._alt;
  }
  set alt(t) {
    this.setAttribute("alt", t);
  }
}
customElements.define("liwe3-image-view", s);
export {
  s as ImageView
};
//# sourceMappingURL=ImageView.js.map
