/**
 * AITextEditor Web Component
 * A text editor with AI-powered text continuation suggestions
 */

const AI_TEXT_EDITOR_API_KEY = 'ai-text-editor-api-key';

export interface AITextEditorConfig {
  apiKey?: string;
  suggestionDelay?: number;
  systemPrompt?: string;
  apiEndpoint?: string;
  modelName?: string;
  context?: string;
}

export class AITextEditorElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private editor!: HTMLTextAreaElement;
  private editorBackground!: HTMLElement;
  private loading!: HTMLElement;
  private editorStatus!: HTMLElement;

  private typingTimer: number | null = null;
  private fullSuggestion: string | null = null;
  private suggestionParagraphs: string[] = [];
  private currentParagraphIndex: number = 0;
  private isShowingSuggestion: boolean = false;

  private apiKey: string = '';
  private suggestionDelay: number = 1000;
  private systemPrompt: string = "You are a helpful writing assistant. Continue the user's text naturally and coherently. Provide 1-3 sentences that would logically follow their writing. Keep the same tone and style. Do not repeat what they've already written.";
  private apiEndpoint: string = 'https://api.openai.com/v1/chat/completions';
  private modelName: string = 'gpt-3.5-turbo';
  private context: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.init();
  }

  /**
   * Renders the component's HTML structure
   */
  private render(): void {
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
  private init(): void {
    const editor = this.shadowRoot.getElementById('editor') as HTMLTextAreaElement;
    const editorBackground = this.shadowRoot.getElementById('editorBackground') as HTMLElement;
    const loading = this.shadowRoot.getElementById('loading') as HTMLElement;

    this.editorStatus = this.shadowRoot.querySelector('.editor-status') as HTMLElement;
    this.editor = editor;
    this.editorBackground = editorBackground;
    this.loading = loading;

    this.editor.addEventListener('input', () => {
      this.handleTextInput();
      this.updateBackground();
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.editor.value } }));
    });

    this.editor.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    this.editor.addEventListener('keyup', (e) => {
      if (this.isShowingSuggestion && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        this.hideSuggestion();
      }
      // Update background on cursor movement, after potentially hiding suggestion
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        this.updateBackground();
      }
    });

    this.editor.addEventListener('click', () => {
      if (this.isShowingSuggestion) {
        this.hideSuggestion();
      }
      // Update background on mouse click (cursor position change)
      // setTimeout ensures cursor position is updated before background redraw
      setTimeout(() => this.updateBackground(), 0);
    });

    this.editor.addEventListener('scroll', () => {
      this.syncScroll();
    });

    this._loadApiKey();
    this._loadSettings();
    this.updateBackground();
  }

  /**
   * Updates the background layer with current text and suggestions
   */
  private updateBackground(): void {
    const currentText = this.editor.value;
    const cursorPosition = this.editor.selectionStart;

    let finalHtmlContent = '';

    if (this.isShowingSuggestion && this.fullSuggestion) {
      const beforeCursorText = currentText.substring(0, cursorPosition);
      const afterCursorText = currentText.substring(cursorPosition);

      // Determine the pending (not yet accepted) part of the suggestion
      const pendingParagraphs = Array.isArray(this.suggestionParagraphs)
        ? this.suggestionParagraphs.slice(this.currentParagraphIndex)
        : [];
      const pendingSuggestionText = pendingParagraphs.join(' ');

      if (pendingSuggestionText.trim().length > 0) {
        const mainSpacer = (beforeCursorText.endsWith(' ') || beforeCursorText === '' || pendingSuggestionText.startsWith(' ') || pendingSuggestionText === '') ? '' : ' ';
        const suggestionBlockHtml = `<span class="suggestion-text">${this.escapeHtml(pendingSuggestionText)}</span>`;

        finalHtmlContent =
          this.escapeHtml(beforeCursorText).replace(/\n/g, '<br>') +
          mainSpacer +
          suggestionBlockHtml +
          this.escapeHtml(afterCursorText).replace(/\n/g, '<br>');
      } else {
        finalHtmlContent = this.escapeHtml(currentText).replace(/\n/g, '<br>');
      }
    } else {
      finalHtmlContent = this.escapeHtml(currentText).replace(/\n/g, '<br>');
    }

    this.editorBackground.innerHTML = finalHtmlContent;
    this.syncScroll();
  }

  /**
   * Synchronizes scroll position between editor and background
   */
  private syncScroll(): void {
    this.editorBackground.scrollTop = this.editor.scrollTop;
    this.editorBackground.scrollLeft = this.editor.scrollLeft;
  }

  /**
   * Handles text input events
   */
  private handleTextInput(): void {
    this.hideSuggestion();

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    if (!this.apiKey) return;

    this.typingTimer = window.setTimeout(() => {
      this.requestSuggestion();
    }, this.suggestionDelay);
  }

  /**
   * Handles keyboard events
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (this.isShowingSuggestion) {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.acceptSuggestion();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hideSuggestion();
      }
    }
  }

  /**
   * Requests an AI suggestion for the current text
   */
  private async requestSuggestion(): Promise<void> {
    if (!this.apiKey) return;

    const currentText = this.editor.value;
    if (!currentText.trim()) return;

    // Get text up to cursor position for context
    const cursorPosition = this.editor.selectionStart;
    const textUpToCursor = currentText.substring(0, cursorPosition);

    // Dispatch an event before starting the AI request, allow listeners to cancel
    const proceed = this.dispatchEvent(new CustomEvent('beforeSuggestion', {
      detail: {
        text: textUpToCursor,
        context: this.context,
        apiEndpoint: this.apiEndpoint,
        modelName: this.modelName,
        systemPrompt: this.systemPrompt
      },
      cancelable: true
    }));

    if (proceed === false) {
      return; // aborted by listener via event.preventDefault()
    }

    this.showLoading();

    try {
      const suggestion = await this.callOpenAI(textUpToCursor);
      this.hideLoading();

      if (suggestion) {
        this.showSuggestion(suggestion);
      }
    } catch (error) {
      this.hideLoading();
      this.showError('Failed to get AI suggestion: ' + (error as Error).message);
    }
  }

  /**
   * Calls the OpenAI API for text completion
   */
  private async callOpenAI(text: string): Promise<string> {
    const parts: string[] = [];
    if (this.context && this.context.trim()) {
      parts.push(`Context:\n${this.context.trim()}`);
    }
    parts.push(`Please continue this text naturally:\n\n${text}`);
    const userContent = parts.join('\n\n');

    // Prepare headers - only add Authorization if API key is provided
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey && this.apiKey.trim() !== '') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const requestBody = {
      model: this.modelName,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    };

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  }

  /**
   * Shows an AI suggestion
   */
  private showSuggestion(suggestion: string): void {
    this.fullSuggestion = suggestion;
    this.suggestionParagraphs = this.splitIntoParagraphs(suggestion);
    this.currentParagraphIndex = 0;
    this.isShowingSuggestion = true;
    this.updateBackground();
  }

  /**
   * Splits text into paragraphs/sentences
   */
  private splitIntoParagraphs(text: string): string[] {
    // Split on periods followed by space and capital letter, or double newlines
    const sentences = text.split(/(?<=\.)\s+(?=[A-Z])|(?:\n\s*\n)/);
    return sentences.filter(sentence => sentence.trim().length > 0);
  }

  /**
   * Hides the current suggestion
   */
  private hideSuggestion(): void {
    this.isShowingSuggestion = false;
    this.fullSuggestion = null;
    this.suggestionParagraphs = [];
    this.currentParagraphIndex = 0;
    this.updateBackground();
  }

  /**
   * Accepts the current suggestion paragraph
   */
  private acceptSuggestion(): void {
    if (this.fullSuggestion && this.currentParagraphIndex < this.suggestionParagraphs.length) {
      const currentText = this.editor.value;
      const cursorPosition = this.editor.selectionStart;
      const paragraphToAdd = this.suggestionParagraphs[this.currentParagraphIndex];

      // Insert at cursor position
      const beforeCursor = currentText.substring(0, cursorPosition);
      const afterCursor = currentText.substring(cursorPosition);

      // Refined spacer logic
      const spacer = (beforeCursor.endsWith(' ') || beforeCursor === '' || paragraphToAdd.startsWith(' ') || paragraphToAdd === '') ? '' : ' ';
      const newText = beforeCursor + spacer + paragraphToAdd + afterCursor;

      this.editor.value = newText;

      // Update cursor position to after the inserted text
      const newCursorPosition = cursorPosition + spacer.length + paragraphToAdd.length;
      this.editor.setSelectionRange(newCursorPosition, newCursorPosition);
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.editor.value } }));

      // Move to next paragraph or hide if no more paragraphs
      this.currentParagraphIndex++;
      if (this.currentParagraphIndex >= this.suggestionParagraphs.length) {
        this.hideSuggestion();
      } else {
        this.updateBackground();
      }
    }
  }

  /**
   * Shows loading indicator
   */
  private showLoading(): void {
    this.loading.classList.add('show');
  }

  /**
   * Hides loading indicator
   */
  private hideLoading(): void {
    this.loading.classList.remove('show');
  }

  /**
   * Shows an error message
   */
  private showError(message: string): void {
    console.error('AI Text Editor Error:', message);
    // Try to dispatch a custom error event that can be handled by parent
    this.dispatchEvent(new CustomEvent('error', {
      detail: { message },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Escapes HTML special characters
   */
  private escapeHtml(unsafe: any): string {
    if (typeof unsafe !== 'string') {
      if (unsafe === null || typeof unsafe === 'undefined') {
        return '';
      }
      unsafe = String(unsafe);
    }
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Sets the text content
   */
  setText(text: string): void {
    this.editor.value = text;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.editor.value } }));
    this.hideSuggestion();
    this.updateBackground();
  }

  /**
   * Gets the text content
   */
  getText(): string {
    return this.editor.value;
  }

  /**
   * Sets the API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    this._saveApiKey();
    this.editorStatus.style.backgroundColor = this.apiKey ? '#4caf50' : '#777';
  }

  /**
   * Saves API key to localStorage
   */
  private _saveApiKey(): void {
    if (!this.apiKey) {
      localStorage.removeItem(AI_TEXT_EDITOR_API_KEY);
      return;
    }

    // Encrypt the API key in base64 format
    const encryptedKey = btoa(this.apiKey);
    localStorage.setItem(AI_TEXT_EDITOR_API_KEY, encryptedKey);
  }

  /**
   * Loads API key from localStorage
   */
  private _loadApiKey(): void {
    const savedKey = localStorage.getItem(AI_TEXT_EDITOR_API_KEY);
    if (!savedKey) {
      this.setApiKey('');
      return;
    }

    const decryptedKey = atob(savedKey);
    this.setApiKey(decryptedKey);
  }

  /**
   * Gets the API key
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Sets the suggestion delay in seconds
   */
  setSuggestionDelay(seconds: number): void {
    this.suggestionDelay = seconds * 1000;
  }

  /**
   * Gets the suggestion delay in seconds
   */
  getSuggestionDelay(): number {
    return this.suggestionDelay / 1000;
  }

  /**
   * Sets the system prompt
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  /**
   * Gets the system prompt
   */
  getSystemPrompt(): string {
    return this.systemPrompt;
  }

  /**
   * Sets the API endpoint
   */
  setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
    this._saveSettings();
  }

  /**
   * Gets the API endpoint
   */
  getApiEndpoint(): string {
    return this.apiEndpoint;
  }

  /**
   * Sets the model name
   */
  setModelName(modelName: string): void {
    this.modelName = modelName;
    this._saveSettings();
  }

  /**
   * Gets the model name
   */
  getModelName(): string {
    return this.modelName;
  }

  /**
   * Sets the context
   */
  setContext(context: string): void {
    this.context = typeof context === 'string' ? context : '';
  }

  /**
   * Gets the context
   */
  getContext(): string {
    return this.context;
  }

  /**
   * Saves settings to localStorage
   */
  private _saveSettings(): void {
    const settings = {
      apiEndpoint: this.apiEndpoint,
      modelName: this.modelName
    };
    localStorage.setItem('ai-text-editor-settings', JSON.stringify(settings));
  }

  /**
   * Loads settings from localStorage
   */
  private _loadSettings(): void {
    const savedSettings = localStorage.getItem('ai-text-editor-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.apiEndpoint) {
          this.apiEndpoint = settings.apiEndpoint;
        }
        if (settings.modelName) {
          this.modelName = settings.modelName;
        }
      } catch (error) {
        console.warn('Failed to load saved settings:', error);
      }
    }
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineAITextEditor = (tagName: string = 'liwe3-ai-text-editor'): void => {
  if (typeof window !== 'undefined' && !window.customElements.get(tagName)) {
    customElements.define(tagName, AITextEditorElement);
  }
};

// Auto-register with default tag name
defineAITextEditor();

export { defineAITextEditor };
