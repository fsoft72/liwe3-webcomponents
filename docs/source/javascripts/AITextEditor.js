const g = "ai-text-editor-api-key";
class l extends HTMLElement {
  constructor() {
    super(), this.typingTimer = null, this.fullSuggestion = null, this.suggestionParagraphs = [], this.currentParagraphIndex = 0, this.isShowingSuggestion = !1, this.apiKey = "", this.suggestionDelay = 1e3, this.systemPrompt = "You are a helpful writing assistant. Continue the user's text naturally and coherently. Provide 1-3 sentences that would logically follow their writing. Keep the same tone and style. Do not repeat what they've already written.", this.apiEndpoint = "https://api.openai.com/v1/chat/completions", this.modelName = "gpt-3.5-turbo", this.context = "", this.attachShadow({ mode: "open" }), this.render(), this.init();
  }
  /**
   * Renders the component's HTML structure
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        .editor-container {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .editor-status {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 10px;
          height: 10px;
          border-radius: 100%;
          background: #777;
          z-index: 10;
        }

        .editor-wrapper {
          position: relative;
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .editor {
          width: 100%;
          height: 100%;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          padding: 20px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          resize: none;
          background: #fafbfc;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          background: transparent;
          box-sizing: border-box;
          min-height: auto;
        }

        .editor:focus {
          outline: none;
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }

        .editor-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          padding: 20px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          background: #fafbfc;
          z-index: 1;
          pointer-events: none;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          color: transparent;
          box-sizing: border-box;
        }

        .editor-wrapper:focus-within .editor-background {
          background: white;
          border-color: #4facfe;
        }

        .suggestion-text {
          color: #bbb;
          position: relative;
        }

        .suggestion-text.accepted {
          color: #ddd;
          text-decoration: line-through;
        }

        .loading {
          position: absolute;
          top: 5px;
          right: 10px;
          z-index: 10;
          display: none;
        }

        .loading.show {
          display: block;
        }

        .spinner {
          width: 10px;
          height: 10px;
          border: 2px solid #e1e5e9;
          border-top: 2px solid #4facfe;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>

      <div class="editor-container">
        <div class="editor-status"></div>
        <div class="loading" id="loading">
          <div class="spinner"></div>
        </div>

        <div class="editor-wrapper">
          <div class="editor-background" id="editorBackground"></div>
          <textarea
            class="editor"
            id="editor"
            placeholder="Start writing your markdown text here..."
          ></textarea>
        </div>
      </div>
    `;
  }
  /**
   * Initializes the component after rendering
   */
  init() {
    const t = this.shadowRoot.getElementById("editor"), e = this.shadowRoot.getElementById("editorBackground"), i = this.shadowRoot.getElementById("loading");
    this.editorStatus = this.shadowRoot.querySelector(".editor-status"), this.editor = t, this.editorBackground = e, this.loading = i, this.editor.addEventListener("input", () => {
      this.handleTextInput(), this.updateBackground(), this.dispatchEvent(new CustomEvent("change", { detail: { value: this.editor.value } }));
    }), this.editor.addEventListener("keydown", (s) => {
      this.handleKeyDown(s);
    }), this.editor.addEventListener("keyup", (s) => {
      this.isShowingSuggestion && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(s.key) && this.hideSuggestion(), ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(s.key) && this.updateBackground();
    }), this.editor.addEventListener("click", () => {
      this.isShowingSuggestion && this.hideSuggestion(), setTimeout(() => this.updateBackground(), 0);
    }), this.editor.addEventListener("scroll", () => {
      this.syncScroll();
    }), this._loadApiKey(), this._loadSettings(), this.updateBackground();
  }
  /**
   * Updates the background layer with current text and suggestions
   */
  updateBackground() {
    const t = this.editor.value, e = this.editor.selectionStart;
    let i = "";
    if (this.isShowingSuggestion && this.fullSuggestion) {
      const s = t.substring(0, e), o = t.substring(e), a = (Array.isArray(this.suggestionParagraphs) ? this.suggestionParagraphs.slice(this.currentParagraphIndex) : []).join(" ");
      if (a.trim().length > 0) {
        const n = s.endsWith(" ") || s === "" || a.startsWith(" ") || a === "" ? "" : " ", d = `<span class="suggestion-text">${this.escapeHtml(a)}</span>`;
        i = this.escapeHtml(s).replace(/\n/g, "<br>") + n + d + this.escapeHtml(o).replace(/\n/g, "<br>");
      } else
        i = this.escapeHtml(t).replace(/\n/g, "<br>");
    } else
      i = this.escapeHtml(t).replace(/\n/g, "<br>");
    this.editorBackground.innerHTML = i, this.syncScroll();
  }
  /**
   * Synchronizes scroll position between editor and background
   */
  syncScroll() {
    this.editorBackground.scrollTop = this.editor.scrollTop, this.editorBackground.scrollLeft = this.editor.scrollLeft;
  }
  /**
   * Handles text input events
   */
  handleTextInput() {
    this.hideSuggestion(), this.typingTimer && clearTimeout(this.typingTimer), this.apiKey && (this.typingTimer = window.setTimeout(() => {
      this.requestSuggestion();
    }, this.suggestionDelay));
  }
  /**
   * Handles keyboard events
   */
  handleKeyDown(t) {
    this.isShowingSuggestion && (t.key === "Tab" ? (t.preventDefault(), this.acceptSuggestion()) : t.key === "Escape" && (t.preventDefault(), this.hideSuggestion()));
  }
  /**
   * Requests an AI suggestion for the current text
   */
  async requestSuggestion() {
    if (!this.apiKey) return;
    const t = this.editor.value;
    if (!t.trim()) return;
    const e = this.editor.selectionStart, i = t.substring(0, e);
    if (this.dispatchEvent(new CustomEvent("beforeSuggestion", {
      detail: {
        text: i,
        context: this.context,
        apiEndpoint: this.apiEndpoint,
        modelName: this.modelName,
        systemPrompt: this.systemPrompt
      },
      cancelable: !0
    })) !== !1) {
      this.showLoading();
      try {
        const o = await this.callOpenAI(i);
        this.hideLoading(), o && this.showSuggestion(o);
      } catch (o) {
        this.hideLoading(), this.showError("Failed to get AI suggestion: " + o.message);
      }
    }
  }
  /**
   * Calls the OpenAI API for text completion
   */
  async callOpenAI(t) {
    const e = [];
    this.context && this.context.trim() && e.push(`Context:
${this.context.trim()}`), e.push(`Please continue this text naturally:

${t}`);
    const i = e.join(`

`), s = {
      "Content-Type": "application/json"
    };
    this.apiKey && this.apiKey.trim() !== "" && (s.Authorization = `Bearer ${this.apiKey}`);
    const o = {
      model: this.modelName,
      messages: [
        {
          role: "system",
          content: this.systemPrompt
        },
        {
          role: "user",
          content: i
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    }, r = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: s,
      body: JSON.stringify(o)
    });
    if (!r.ok) {
      let n = "API request failed";
      try {
        n = (await r.json()).error?.message || n;
      } catch (d) {
        console.error("Failed to parse error response:", d), n = `HTTP ${r.status}: ${r.statusText}`;
      }
      throw new Error(n);
    }
    return (await r.json()).choices[0]?.message?.content?.trim();
  }
  /**
   * Shows an AI suggestion
   */
  showSuggestion(t) {
    this.fullSuggestion = t, this.suggestionParagraphs = this.splitIntoParagraphs(t), this.currentParagraphIndex = 0, this.isShowingSuggestion = !0, this.updateBackground();
  }
  /**
   * Splits text into paragraphs/sentences
   */
  splitIntoParagraphs(t) {
    return t.split(new RegExp("(?<=\\.)\\s+(?=[A-Z])|(?:\\n\\s*\\n)")).filter((i) => i.trim().length > 0);
  }
  /**
   * Hides the current suggestion
   */
  hideSuggestion() {
    this.isShowingSuggestion = !1, this.fullSuggestion = null, this.suggestionParagraphs = [], this.currentParagraphIndex = 0, this.updateBackground();
  }
  /**
   * Accepts the current suggestion paragraph
   */
  acceptSuggestion() {
    if (this.fullSuggestion && this.currentParagraphIndex < this.suggestionParagraphs.length) {
      const t = this.editor.value, e = this.editor.selectionStart, i = this.suggestionParagraphs[this.currentParagraphIndex], s = t.substring(0, e), o = t.substring(e), r = s.endsWith(" ") || s === "" || i.startsWith(" ") || i === "" ? "" : " ", a = s + r + i + o;
      this.editor.value = a;
      const n = e + r.length + i.length;
      this.editor.setSelectionRange(n, n), this.dispatchEvent(new CustomEvent("change", { detail: { value: this.editor.value } })), this.currentParagraphIndex++, this.currentParagraphIndex >= this.suggestionParagraphs.length ? this.hideSuggestion() : this.updateBackground();
    }
  }
  /**
   * Shows loading indicator
   */
  showLoading() {
    this.loading.classList.add("show");
  }
  /**
   * Hides loading indicator
   */
  hideLoading() {
    this.loading.classList.remove("show");
  }
  /**
   * Shows an error message
   */
  showError(t) {
    console.error("AI Text Editor Error:", t), this.dispatchEvent(new CustomEvent("error", {
      detail: { message: t },
      bubbles: !0,
      composed: !0
    }));
  }
  /**
   * Escapes HTML special characters
   */
  escapeHtml(t) {
    if (typeof t != "string") {
      if (t === null || typeof t > "u")
        return "";
      t = String(t);
    }
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  /**
   * Sets the text content
   */
  setText(t) {
    this.editor.value = t, this.dispatchEvent(new CustomEvent("change", { detail: { value: this.editor.value } })), this.hideSuggestion(), this.updateBackground();
  }
  /**
   * Gets the text content
   */
  getText() {
    return this.editor.value;
  }
  /**
   * Sets the API key
   */
  setApiKey(t) {
    this.apiKey = t, this._saveApiKey(), this.editorStatus.style.backgroundColor = this.apiKey ? "#4caf50" : "#777";
  }
  /**
   * Saves API key to localStorage
   */
  _saveApiKey() {
    if (!this.apiKey) {
      localStorage.removeItem(g);
      return;
    }
    const t = btoa(this.apiKey);
    localStorage.setItem(g, t);
  }
  /**
   * Loads API key from localStorage
   */
  _loadApiKey() {
    const t = localStorage.getItem(g);
    if (!t) {
      this.setApiKey("");
      return;
    }
    const e = atob(t);
    this.setApiKey(e);
  }
  /**
   * Gets the API key
   */
  getApiKey() {
    return this.apiKey;
  }
  /**
   * Sets the suggestion delay in seconds
   */
  setSuggestionDelay(t) {
    this.suggestionDelay = t * 1e3;
  }
  /**
   * Gets the suggestion delay in seconds
   */
  getSuggestionDelay() {
    return this.suggestionDelay / 1e3;
  }
  /**
   * Sets the system prompt
   */
  setSystemPrompt(t) {
    this.systemPrompt = t;
  }
  /**
   * Gets the system prompt
   */
  getSystemPrompt() {
    return this.systemPrompt;
  }
  /**
   * Sets the API endpoint
   */
  setApiEndpoint(t) {
    this.apiEndpoint = t, this._saveSettings();
  }
  /**
   * Gets the API endpoint
   */
  getApiEndpoint() {
    return this.apiEndpoint;
  }
  /**
   * Sets the model name
   */
  setModelName(t) {
    this.modelName = t, this._saveSettings();
  }
  /**
   * Gets the model name
   */
  getModelName() {
    return this.modelName;
  }
  /**
   * Sets the context
   */
  setContext(t) {
    this.context = typeof t == "string" ? t : "";
  }
  /**
   * Gets the context
   */
  getContext() {
    return this.context;
  }
  /**
   * Saves settings to localStorage
   */
  _saveSettings() {
    const t = {
      apiEndpoint: this.apiEndpoint,
      modelName: this.modelName
    };
    localStorage.setItem("ai-text-editor-settings", JSON.stringify(t));
  }
  /**
   * Loads settings from localStorage
   */
  _loadSettings() {
    const t = localStorage.getItem("ai-text-editor-settings");
    if (t)
      try {
        const e = JSON.parse(t);
        e.apiEndpoint && (this.apiEndpoint = e.apiEndpoint), e.modelName && (this.modelName = e.modelName);
      } catch (e) {
        console.warn("Failed to load saved settings:", e);
      }
  }
}
const c = (h = "liwe3-ai-text-editor") => {
  typeof window < "u" && !window.customElements.get(h) && customElements.define(h, l);
};
c();
export {
  l as AITextEditorElement,
  c as defineAITextEditor
};
//# sourceMappingURL=AITextEditor.js.map
