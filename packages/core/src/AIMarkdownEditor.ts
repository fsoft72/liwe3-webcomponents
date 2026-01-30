import { AITextEditorElement, defineAITextEditor } from './AITextEditor';
import { ButtonToolbarElement, ButtonToolbarGroup, defineButtonToolbar } from './ButtonToolbar';
import { MarkdownPreviewElement, defineMarkdownPreview } from './MarkdownPreview';

export class AIMarkdownEditorElement extends HTMLElement {
	declare shadowRoot : ShadowRoot;
	private aiEditor! : AITextEditorElement;
	private toolbar! : ButtonToolbarElement;
	private preview! : MarkdownPreviewElement;
	private editorStatus! : HTMLElement;
	private loading! : HTMLElement;
	private isPreviewMode : boolean = false;
	private markdownLibUrl : string = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
	private _showSettings : boolean = true;

	static get observedAttributes () : string[] {
		return [ 'show-settings' ];
	}

	constructor () {
		super();
		this.attachShadow( { mode: 'open' } );
	}

	attributeChangedCallback ( name : string, _oldValue : string | null, newValue : string | null ) : void {
		if ( name === 'show-settings' ) {
			this._showSettings = newValue !== 'false';
			this.updateToolbarSettings();
		}
	}

	connectedCallback () : void {
		this.render();
		this.init();
	}

	private render () : void {
		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          gap: 0.5rem;
        }

        .editor-container {
          flex: 1;
          position: relative;
          min-height: 0; /* Important for flexbox scrolling */
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          background: #fafbfc;
        }

        .editor-container:focus-within {
          border-color: #4facfe;
          background: white;
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

        liwe3-ai-text-editor {
          width: 100%;
          height: 100%;
        }

        .settings-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 100;
          width: 400px;
          max-width: 90%;
          display: none;
          border: 1px solid #e5e7eb;
        }

        .settings-modal.open {
          display: block;
        }

        .settings-modal h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #1f2937;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          color: #4b5563;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
          display: none;
        }

        .overlay.open {
          display: block;
        }
      </style>
      <liwe3-button-toolbar id="toolbar"></liwe3-button-toolbar>
      <div class="editor-container">
        <div class="editor-status"></div>
        <div class="loading" id="loading">
          <div class="spinner"></div>
        </div>
        <liwe3-ai-text-editor id="editor"></liwe3-ai-text-editor>
        <liwe3-markdown-preview id="preview" style="display: none; width: 100%; height: 100%; overflow: auto;"></liwe3-markdown-preview>
      </div>

      <div class="overlay" id="overlay"></div>
      <div class="settings-modal" id="settingsModal">
        <h3>AI Settings</h3>
        <div class="form-group">
          <label for="apiKey">API Key</label>
          <input type="password" id="apiKey" placeholder="sk-...">
        </div>
        <div class="form-group">
          <label for="systemPrompt">System Prompt</label>
          <textarea id="systemPrompt"></textarea>
        </div>
        <div class="form-group">
          <label for="modelName">Model Name</label>
          <input type="text" id="modelName" placeholder="gpt-3.5-turbo">
        </div>
        <div class="form-group">
          <label for="apiEndpoint">API Endpoint</label>
          <input type="text" id="apiEndpoint" placeholder="https://api.openai.com/v1/chat/completions">
        </div>
        <div class="form-group">
          <label for="markdownLibUrl">Markdown Library URL</label>
          <input type="text" id="markdownLibUrl" placeholder="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js">
        </div>
        <div class="form-group">
          <label for="suggestionDelay">Suggestion Delay (seconds)</label>
          <input type="number" id="suggestionDelay" step="0.1" min="0.5">
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" id="saveBtn">Save</button>
        </div>
      </div>
    `;
	}

	private init () : void {
		this.aiEditor = this.shadowRoot.getElementById( 'editor' ) as AITextEditorElement;
		this.preview = this.shadowRoot.getElementById( 'preview' ) as MarkdownPreviewElement;
		this.toolbar = this.shadowRoot.getElementById( 'toolbar' ) as ButtonToolbarElement;
		this.editorStatus = this.shadowRoot.querySelector( '.editor-status' ) as HTMLElement;
		this.loading = this.shadowRoot.getElementById( 'loading' ) as HTMLElement;

		// Configure the AITextEditor in embedded mode with callbacks
		this.aiEditor.configure( {
			embedded: true,
			onStatusChange: ( hasApiKey : boolean ) => {
				this.editorStatus.style.backgroundColor = hasApiKey ? '#4caf50' : '#777';
			},
			onLoadingChange: ( isLoading : boolean ) => {
				if ( isLoading ) {
					this.loading.classList.add( 'show' );
				} else {
					this.loading.classList.remove( 'show' );
				}
			},
		} );

		this.setupModal();
		this.setupToolbar();

		// Forward events from aiEditor
		this.aiEditor.addEventListener( 'change', ( e : Event ) => {
			this.dispatchEvent(
				new CustomEvent( 'change', {
					detail: ( e as CustomEvent ).detail,
					bubbles: true,
					composed: true,
				} ),
			);
		} );

		this.aiEditor.addEventListener( 'beforeSuggestion', ( e : Event ) => {
			this.dispatchEvent(
				new CustomEvent( 'beforeSuggestion', {
					detail: ( e as CustomEvent ).detail,
					bubbles: true,
					composed: true,
					cancelable: true,
				} ),
			);
		} );
	}

	private setupModal () : void {
		const modal = this.shadowRoot.getElementById( 'settingsModal' ) as HTMLElement;
		const overlay = this.shadowRoot.getElementById( 'overlay' ) as HTMLElement;
		const cancelBtn = this.shadowRoot.getElementById( 'cancelBtn' ) as HTMLButtonElement;
		const saveBtn = this.shadowRoot.getElementById( 'saveBtn' ) as HTMLButtonElement;

		const close = () => {
			modal.classList.remove( 'open' );
			overlay.classList.remove( 'open' );
		};

		cancelBtn.addEventListener( 'click', close );
		overlay.addEventListener( 'click', close );

		saveBtn.addEventListener( 'click', () => {
			const apiKey = ( this.shadowRoot.getElementById( 'apiKey' ) as HTMLInputElement ).value;
			const systemPrompt = ( this.shadowRoot.getElementById( 'systemPrompt' ) as HTMLTextAreaElement ).value;
			const modelName = ( this.shadowRoot.getElementById( 'modelName' ) as HTMLInputElement ).value;
			const apiEndpoint = ( this.shadowRoot.getElementById( 'apiEndpoint' ) as HTMLInputElement ).value;
			const markdownLibUrl = ( this.shadowRoot.getElementById( 'markdownLibUrl' ) as HTMLInputElement ).value;
			const suggestionDelay = parseFloat( ( this.shadowRoot.getElementById( 'suggestionDelay' ) as HTMLInputElement ).value );

			this.aiEditor.setApiKey( apiKey );
			this.aiEditor.setSystemPrompt( systemPrompt );
			this.aiEditor.setModelName( modelName );
			this.aiEditor.setApiEndpoint( apiEndpoint );
			this.markdownLibUrl = markdownLibUrl;
			if ( !isNaN( suggestionDelay ) ) {
				this.aiEditor.setSuggestionDelay( suggestionDelay );
			}

			close();
		} );
	}

	private openSettings () : void {
		const modal = this.shadowRoot.getElementById( 'settingsModal' ) as HTMLElement;
		const overlay = this.shadowRoot.getElementById( 'overlay' ) as HTMLElement;

		// Load current values
		( this.shadowRoot.getElementById( 'apiKey' ) as HTMLInputElement ).value = this.aiEditor.getApiKey();
		( this.shadowRoot.getElementById( 'systemPrompt' ) as HTMLTextAreaElement ).value = this.aiEditor.getSystemPrompt();
		( this.shadowRoot.getElementById( 'modelName' ) as HTMLInputElement ).value = this.aiEditor.getModelName();
		( this.shadowRoot.getElementById( 'apiEndpoint' ) as HTMLInputElement ).value = this.aiEditor.getApiEndpoint();
		( this.shadowRoot.getElementById( 'markdownLibUrl' ) as HTMLInputElement ).value = this.markdownLibUrl;
		( this.shadowRoot.getElementById( 'suggestionDelay' ) as HTMLInputElement ).value = this.aiEditor.getSuggestionDelay().toString();

		modal.classList.add( 'open' );
		overlay.classList.add( 'open' );
	}

	private setupToolbar () : void {
		this.toolbar.groups = this.buildToolbarGroups();
		this.toolbar.addEventListener( 'button-click', ( e : Event ) => {
			const detail = ( e as CustomEvent ).detail;
			this.handleToolbarAction( detail.id );
		} );
	}

	private buildToolbarGroups () : ButtonToolbarGroup[] {
		const groups : ButtonToolbarGroup[] = [
			{
				id: 'format',
				items: [
					{
						id: 'bold',
						label: 'B',
						tooltip: 'Bold',
						icon:
							'<svg viewBox="0 0 24 24"><path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.26 7.586A4.5 4.5 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8z"/></svg>',
					},
					{
						id: 'italic',
						label: 'I',
						tooltip: 'Italic',
						icon: '<svg viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>',
					},
					{
						id: 'underline',
						label: 'U',
						tooltip: 'Underline',
						icon:
							'<svg viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>',
					},
				],
			},
			{
				id: 'lists',
				items: [
					{
						id: 'ul',
						label: 'UL',
						tooltip: 'Unordered List',
						icon:
							'<svg viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>',
					},
					{
						id: 'ol',
						label: 'OL',
						tooltip: 'Numbered List',
						icon:
							'<svg viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>',
					},
				],
			},
			{
				id: 'actions',
				items: [
					{
						id: 'preview',
						tooltip: 'Toggle Preview',
						icon:
							'<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
					},
					...( this._showSettings
						? [ {
							id: 'settings',
							tooltip: 'AI Settings',
							icon:
								'<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L4.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.08-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
						} ]
						: [] ),
				],
			},
		];

		return groups;
	}

	private updateToolbarSettings () : void {
		if ( this.toolbar ) {
			this.toolbar.groups = this.buildToolbarGroups();
		}
	}

	private togglePreview () : void {
		this.isPreviewMode = !this.isPreviewMode;
		if ( this.isPreviewMode ) {
			this.preview.value = this.aiEditor.getText();
			this.preview.libUrl = this.markdownLibUrl;
			this.aiEditor.style.display = 'none';
			this.preview.style.display = 'block';
		} else {
			this.aiEditor.style.display = 'block';
			this.preview.style.display = 'none';
		}
	}

	private handleToolbarAction ( actionId : string ) : void {
		if ( actionId === 'preview' ) {
			this.togglePreview();
			return;
		}

		const textarea = this.aiEditor.shadowRoot?.getElementById( 'editor' ) as HTMLTextAreaElement;
		if ( !textarea ) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const selectedText = text.substring( start, end );

		let newText = '';
		let newCursorPos = end;

		switch ( actionId ) {
			case 'settings':
				this.openSettings();
				return; // Exit early as we don't need text manipulation
			case 'bold':
				newText = text.substring( 0, start ) + `**${selectedText}**` + text.substring( end );
				newCursorPos = end + 4; // ** + **
				if ( start === end ) newCursorPos = start + 2; // Position inside **
				break;
			case 'italic':
				newText = text.substring( 0, start ) + `*${selectedText}*` + text.substring( end );
				newCursorPos = end + 2; // * + *
				if ( start === end ) newCursorPos = start + 1; // Position inside *
				break;
			case 'underline':
				newText = text.substring( 0, start ) + `<u>${selectedText}</u>` + text.substring( end );
				newCursorPos = end + 7; // <u> + </u>
				if ( start === end ) newCursorPos = start + 3; // Position inside <u>
				break;
			case 'ul':
				// For lists, we want to handle multiline selection
				if ( start !== end ) {
					const lines = selectedText.split( '\n' );
					const listText = lines.map( ( line ) => `- ${line}` ).join( '\n' );
					newText = text.substring( 0, start ) + listText + text.substring( end );
					newCursorPos = start + listText.length;
				} else {
					// Insert at beginning of line? Or just insert marker?
					// Simple version: insert marker
					newText = text.substring( 0, start ) + `- ` + text.substring( end );
					newCursorPos = start + 2;
				}
				break;
			case 'ol':
				if ( start !== end ) {
					const lines = selectedText.split( '\n' );
					const listText = lines.map( ( line, i ) => `${i + 1}. ${line}` ).join( '\n' );
					newText = text.substring( 0, start ) + listText + text.substring( end );
					newCursorPos = start + listText.length;
				} else {
					newText = text.substring( 0, start ) + `1. ` + text.substring( end );
					newCursorPos = start + 3;
				}
				break;
		}

		if ( newText ) {
			textarea.value = newText;
			textarea.focus();

			// If we just inserted markers around empty selection, put cursor inside
			if ( start === end ) {
				if ( actionId === 'bold' ) textarea.setSelectionRange( start + 2, start + 2 );
				else if ( actionId === 'italic' ) textarea.setSelectionRange( start + 1, start + 1 );
				else if ( actionId === 'underline' ) textarea.setSelectionRange( start + 3, start + 3 );
				else textarea.setSelectionRange( newCursorPos, newCursorPos );
			} else {
				// Select the modified text
				// This is a bit complex to calculate exactly for all cases, so just putting cursor at end for now
				textarea.setSelectionRange( newCursorPos, newCursorPos );
			}

			// Trigger input event so AITextEditor updates
			textarea.dispatchEvent( new Event( 'input', { bubbles: true } ) );
		}
	}

	// Proxy methods to AITextEditor
	setText ( text : string ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setText( text );
		}
	}

	getText () : string {
		return this.aiEditor ? this.aiEditor.getText() : '';
	}

	setApiKey ( key : string ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setApiKey( key );
		}
	}

	getApiKey () : string {
		return this.aiEditor ? this.aiEditor.getApiKey() : '';
	}

	setSuggestionDelay ( seconds : number ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setSuggestionDelay( seconds );
		}
	}

	getSuggestionDelay () : number {
		return this.aiEditor ? this.aiEditor.getSuggestionDelay() : 1;
	}

	setSystemPrompt ( prompt : string ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setSystemPrompt( prompt );
		}
	}

	getSystemPrompt () : string {
		return this.aiEditor ? this.aiEditor.getSystemPrompt() : '';
	}

	setApiEndpoint ( endpoint : string ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setApiEndpoint( endpoint );
		}
	}

	getApiEndpoint () : string {
		return this.aiEditor ? this.aiEditor.getApiEndpoint() : '';
	}

	setModelName ( modelName : string ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setModelName( modelName );
		}
	}

	getModelName () : string {
		return this.aiEditor ? this.aiEditor.getModelName() : '';
	}

	setContext ( context : string ) : void {
		if ( this.aiEditor ) {
			this.aiEditor.setContext( context );
		}
	}

	getContext () : string {
		return this.aiEditor ? this.aiEditor.getContext() : '';
	}

	setShowSettings ( show : boolean ) : void {
		this._showSettings = show;
		this.updateToolbarSettings();
	}

	getShowSettings () : boolean {
		return this._showSettings;
	}
}

export const defineAIMarkdownEditor = ( tagName : string = 'liwe3-ai-markdown-editor' ) : void => {
	if ( typeof window !== 'undefined' ) {
		defineAITextEditor();
		defineButtonToolbar();
		defineMarkdownPreview();
		if ( !customElements.get( tagName ) ) {
			customElements.define( tagName, AIMarkdownEditorElement );
		}
	}
};
