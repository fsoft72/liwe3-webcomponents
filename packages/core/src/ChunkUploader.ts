/**
 * ChunkUploader Web Component
 * A file uploader with drag & drop, file previews, and chunked upload support
 */

export interface UploadedFile {
	id : string;
	file : File;
	status : 'pending' | 'uploading' | 'completed' | 'error' | 'aborted';
	progress : number;
	uploadedBytes : number;
	preview? : string;
	error? : string;
	uploadId? : string; // R2 upload ID for aborting
	key? : string; // R2 key for aborting
}

export interface ChunkUploaderConfig {
	serverURL : string;
	chunkSize : number; // in MB
	authToken? : string;
	validFiletypes? : string[]; // Array of extensions like ['jpg', 'png', 'pdf']
	maxFileSize? : number; // in MB
	labelDropFiles? : string; // Custom text for drop zone (default: "Drop files here")
	labelBrowse? : string; // Custom label for browse button (default: "Browse Files")
	folder? : string; // Destination folder name for uploads
	compact? : boolean; // Compact mode (single file, no preview)
	onfilecomplete? : ( file : UploadedFile ) => void;
	onuploadcomplete? : ( files : UploadedFile[] ) => void;
	parseResponse? : ( response : any, endpoint : 'initiate' | 'part' | 'complete' ) => any; // Transform endpoint responses
}

const DEFAULT_CHUNK_SIZE = 5; // 5MB - R2/S3 minimum part size (except last part)
const DEFAULT_MAX_FILE_SIZE = 5120; // 5GB in MB

export class ChunkUploaderElement extends HTMLElement {
	declare shadowRoot : ShadowRoot;
	private files : Map<string, UploadedFile> = new Map();
	private config : ChunkUploaderConfig = {
		serverURL: '',
		chunkSize: DEFAULT_CHUNK_SIZE,
		maxFileSize: DEFAULT_MAX_FILE_SIZE,
	};
	private isUploading = false;
	private abortController : AbortController | null = null;

	constructor () {
		super();
		this.attachShadow( { mode: 'open' } );
		this.render();
		this.bindEvents();
	}

	static get observedAttributes () : string[] {
		return [ 'server-url', 'chunk-size', 'auth-token', 'valid-filetypes', 'max-file-size', 'label-drop-files', 'label-browse', 'folder', 'compact' ];
	}

	attributeChangedCallback ( name : string, oldValue : string | null, newValue : string | null ) : void {
		if ( oldValue !== newValue ) {
			switch ( name ) {
				case 'server-url':
					this.config.serverURL = newValue || '';
					break;
				case 'chunk-size':
					this.config.chunkSize = parseFloat( newValue || String( DEFAULT_CHUNK_SIZE ) );
					break;
				case 'auth-token':
					this.config.authToken = newValue || undefined;
					break;
				case 'valid-filetypes':
					this.config.validFiletypes = newValue ? newValue.split( ',' ).map( ( ext ) => ext.trim() ) : undefined;
					break;
				case 'max-file-size':
					this.config.maxFileSize = parseFloat( newValue || String( DEFAULT_MAX_FILE_SIZE ) );
					break;
				case 'label-drop-files':
					this.config.labelDropFiles = newValue || undefined;
					this.updateLabels();
					break;
				case 'label-browse':
					this.config.labelBrowse = newValue || undefined;
					this.updateLabels();
					break;
				case 'folder':
					this.config.folder = newValue || undefined;
					break;
				case 'compact':
					this.config.compact = newValue !== null;
					this.updateCompactMode();
					break;
			}
		}
	}

	// Property getters and setters
	get serverURL () : string {
		return this.config.serverURL;
	}

	set serverURL ( value : string ) {
		this.config.serverURL = value;
		this.setAttribute( 'server-url', value );
	}

	get chunkSize () : number {
		return this.config.chunkSize;
	}

	set chunkSize ( value : number ) {
		this.config.chunkSize = value;
		this.setAttribute( 'chunk-size', value.toString() );
	}

	get authToken () : string | undefined {
		return this.config.authToken;
	}

	set authToken ( value : string | undefined ) {
		if ( value ) {
			this.config.authToken = value;
			this.setAttribute( 'auth-token', value );
		} else {
			this.config.authToken = undefined;
			this.removeAttribute( 'auth-token' );
		}
	}

	get validFiletypes () : string[] | undefined {
		return this.config.validFiletypes;
	}

	set validFiletypes ( value : string[] | undefined ) {
		this.config.validFiletypes = value;
		if ( value ) {
			this.setAttribute( 'valid-filetypes', value.join( ',' ) );
		} else {
			this.removeAttribute( 'valid-filetypes' );
		}
	}

	get maxFileSize () : number {
		return this.config.maxFileSize || DEFAULT_MAX_FILE_SIZE;
	}

	set maxFileSize ( value : number ) {
		this.config.maxFileSize = value;
		this.setAttribute( 'max-file-size', value.toString() );
	}

	get labelDropFiles () : string | undefined {
		return this.config.labelDropFiles;
	}

	set labelDropFiles ( value : string | undefined ) {
		this.config.labelDropFiles = value;
		if ( value ) {
			this.setAttribute( 'label-drop-files', value );
		} else {
			this.removeAttribute( 'label-drop-files' );
		}
		this.updateLabels();
	}

	get labelBrowse () : string | undefined {
		return this.config.labelBrowse;
	}

	set labelBrowse ( value : string | undefined ) {
		this.config.labelBrowse = value;
		if ( value ) {
			this.setAttribute( 'label-browse', value );
		} else {
			this.removeAttribute( 'label-browse' );
		}
		this.updateLabels();
	}

	get folder () : string | undefined {
		return this.config.folder;
	}

	set folder ( value : string | undefined ) {
		this.config.folder = value;
		if ( value ) {
			this.setAttribute( 'folder', value );
		} else {
			this.removeAttribute( 'folder' );
		}
	}

	get compact () : boolean {
		return !!this.config.compact;
	}

	set compact ( value : boolean ) {
		this.config.compact = value;
		if ( value ) {
			this.setAttribute( 'compact', '' );
		} else {
			this.removeAttribute( 'compact' );
		}
		this.updateCompactMode();
	}

	set onfilecomplete ( callback : (( file : UploadedFile ) => void) | undefined ) {
		this.config.onfilecomplete = callback;
	}

	set onuploadcomplete ( callback : (( files : UploadedFile[] ) => void) | undefined ) {
		this.config.onuploadcomplete = callback;
	}

	set parseResponse ( callback : (( response : any, endpoint : 'initiate' | 'part' | 'complete' ) => any) | undefined ) {
		this.config.parseResponse = callback;
	}

	/**
	 * Updates labels in the DOM when properties change
	 */
	private updateLabels () : void {
		const dropText = this.shadowRoot.querySelector( '.upload-text' );
		const browseBtn = this.shadowRoot.querySelector( '#browseBtn' );

		if ( dropText ) {
			dropText.textContent = this.config.labelDropFiles || 'Drop files here';
		}
		if ( browseBtn ) {
			browseBtn.textContent = this.config.labelBrowse || 'Browse Files';
		}
	}

	/**
	 * Updates compact mode styles and attributes
	 */
	private updateCompactMode () : void {
		const container = this.shadowRoot.querySelector( '.container' );
		const fileInput = this.shadowRoot.querySelector( '#fileInput' ) as HTMLInputElement;

		if ( this.config.compact ) {
			container?.classList.add( 'compact' );
			fileInput?.removeAttribute( 'multiple' );
		} else {
			container?.classList.remove( 'compact' );
			fileInput?.setAttribute( 'multiple', '' );
		}
	}

	/**
	 * Formats bytes to human readable string
	 */
	private formatBytes ( bytes : number ) : string {
		if ( bytes === 0 ) return '0 Bytes';
		const k = 1024;
		const sizes = [ 'Bytes', 'KB', 'MB', 'GB' ];
		const i = Math.floor( Math.log( bytes ) / Math.log( k ) );
		return Math.round( ( bytes / Math.pow( k, i ) ) * 100 ) / 100 + ' ' + sizes[i];
	}

	/**
	 * Generates a unique ID for a file
	 */
	private generateFileId () : string {
		return `file-${Date.now()}-${Math.random().toString( 36 ).substr( 2, 9 )}`;
	}

	/**
	 * Validates a file based on config
	 */
	private validateFile ( file : File ) : { valid : boolean; error? : string } {
		// Check file size
		const maxSizeBytes = this.maxFileSize * 1024 * 1024;
		if ( file.size > maxSizeBytes ) {
			return {
				valid: false,
				error: `File size exceeds maximum of ${this.formatBytes( maxSizeBytes )}`,
			};
		}

		// Check file type
		if ( this.config.validFiletypes && this.config.validFiletypes.length > 0 ) {
			const extension = file.name.split( '.' ).pop()?.toLowerCase();
			if ( !extension || !this.config.validFiletypes.includes( extension ) ) {
				return {
					valid: false,
					error: `File type .${extension} is not allowed. Valid types: ${this.config.validFiletypes.join( ', ' )}`,
				};
			}
		}

		return { valid: true };
	}

	/**
	 * Generates a preview for image files
	 */
	private async generatePreview ( file : File ) : Promise<string | undefined> {
		if ( !file.type.startsWith( 'image/' ) ) return undefined;

		return new Promise( ( resolve ) => {
			const reader = new FileReader();
			reader.onload = ( e ) => resolve( e.target?.result as string );
			reader.onerror = () => resolve( undefined );
			reader.readAsDataURL( file );
		} );
	}

	/**
	 * Adds files to the upload queue
	 */
	private async addFiles ( fileList : FileList ) : Promise<void> {
		if ( this.config.compact ) {
			this.files.clear();
		}

		const files = Array.from( fileList );
		const filesToProcess = this.config.compact ? [ files[0] ] : files;

		for ( const file of filesToProcess ) {
			if ( !file ) continue;
			const validation = this.validateFile( file );

			const id = this.generateFileId();
			const uploadedFile : UploadedFile = {
				id,
				file,
				status: validation.valid ? 'pending' : 'error',
				progress: 0,
				uploadedBytes: 0,
				error: validation.error,
			};

			// Generate preview for images
			if ( validation.valid && file.type.startsWith( 'image/' ) ) {
				uploadedFile.preview = await this.generatePreview( file );
			}

			this.files.set( id, uploadedFile );
		}

		this.renderFileCards();
	}

	/**
	 * Removes a file from the queue
	 */
	private removeFile ( id : string ) : void {
		this.files.delete( id );
		this.renderFileCards();
	}

	/**
	 * Uploads a single file with chunking
	 */
	private async uploadFile ( uploadedFile : UploadedFile ) : Promise<void> {
		if ( !this.config.serverURL ) {
			throw new Error( 'Server URL is not configured' );
		}

		// Remove trailing slash from serverURL if present
		const serverUrl = this.config.serverURL.replace( /\/$/, '' );

		const { file } = uploadedFile;
		uploadedFile.status = 'uploading';
		uploadedFile.progress = 0;
		this.updateFileCard( uploadedFile.id );

		try {
			const headers : HeadersInit = {
				'Content-Type': 'application/json',
			};

			if ( this.config.authToken ) {
				headers['Authorization'] = `Bearer ${this.config.authToken}`;
			}

			// Step 1: Initiate multipart upload
			const initResponse = await fetch( `${serverUrl}/api/upload/initiate`, {
				method: 'POST',
				mode: 'cors',
				headers,
				body: JSON.stringify( {
					fileName: file.name,
					fileType: file.type,
					folder: this.config.folder,
				} ),
				signal: this.abortController?.signal,
			} );

			if ( !initResponse.ok ) {
				throw new Error( `Failed to initiate upload: ${await initResponse.text()}` );
			}

			let initData = await initResponse.json();
			if ( this.config.parseResponse ) {
				initData = this.config.parseResponse( initData, 'initiate' );
			}
			const { uploadId, key } = initData;

			// Store upload metadata for potential abort
			uploadedFile.uploadId = uploadId;
			uploadedFile.key = key;

			// Step 2: Upload chunks
			const chunkSizeBytes = this.config.chunkSize * 1024 * 1024;
			const totalParts = Math.ceil( file.size / chunkSizeBytes );
			const parts : Array<{ partNumber : number; etag : string }> = [];

			for ( let partNumber = 1; partNumber <= totalParts; partNumber++ ) {
				// Check if upload was aborted
				if ( this.abortController?.signal.aborted ) {
					throw new Error( 'Upload aborted by user' );
				}

				const start = ( partNumber - 1 ) * chunkSizeBytes;
				const end = Math.min( start + chunkSizeBytes, file.size );
				const chunk = file.slice( start, end );

				// Create headers for this part upload
				const partHeaders : HeadersInit = {
					'Content-Type': 'application/octet-stream',
					'X-Upload-Id': uploadId,
					'X-Key': key,
					'X-Part-Number': partNumber.toString(),
				};

				if ( this.config.authToken ) {
					partHeaders['Authorization'] = `Bearer ${this.config.authToken}`;
				}

				const partResponse = await fetch( `${serverUrl}/api/upload/part`, {
					method: 'POST',
					mode: 'cors',
					headers: partHeaders,
					body: chunk,
					signal: this.abortController?.signal,
				} );

				if ( !partResponse.ok ) {
					throw new Error( `Failed to upload part ${partNumber}` );
				}

				let partData = await partResponse.json();
				if ( this.config.parseResponse ) {
					partData = this.config.parseResponse( partData, 'part' );
				}
				const { etag } = partData;
				parts.push( { partNumber, etag } );

				// Update progress
				uploadedFile.uploadedBytes = end;
				uploadedFile.progress = ( uploadedFile.uploadedBytes / file.size ) * 100;
				this.updateFileCard( uploadedFile.id );
			}

			// Step 3: Complete multipart upload
			const completeResponse = await fetch( `${serverUrl}/api/upload/complete`, {
				method: 'POST',
				mode: 'cors',
				headers,
				body: JSON.stringify( {
					uploadId,
					key,
					parts,
				} ),
				signal: this.abortController?.signal,
			} );

			if ( !completeResponse.ok ) {
				throw new Error( 'Failed to complete upload' );
			}

			let completeData = await completeResponse.json();
			if ( this.config.parseResponse ) {
				completeData = this.config.parseResponse( completeData, 'complete' );
			}

			uploadedFile.status = 'completed';
			uploadedFile.progress = 100;
			this.updateFileCard( uploadedFile.id );

			// Dispatch file complete event
			this.dispatchEvent(
				new CustomEvent( 'filecomplete', {
					detail: uploadedFile,
					bubbles: true,
					composed: true,
				} ),
			);

			// Call callback if provided
			if ( this.config.onfilecomplete ) {
				this.config.onfilecomplete( uploadedFile );
			}
		} catch ( error ) {
			// Check if this is an abort error (from AbortController)
			const isAbortError = error instanceof Error
				&& ( error.name === 'AbortError' || error.message === 'Upload aborted by user' );

			// Only set error status if not aborted
			if ( !isAbortError ) {
				uploadedFile.status = 'error';
				uploadedFile.error = error instanceof Error ? error.message : 'Unknown error';
				this.updateFileCard( uploadedFile.id );
			}
			throw error;
		}
	}

	/**
	 * Starts uploading all pending files
	 */
	private async startUpload () : Promise<void> {
		if ( this.isUploading ) return;

		const pendingFiles = Array.from( this.files.values() ).filter( ( f ) => f.status === 'pending' );
		if ( pendingFiles.length === 0 ) return;

		this.isUploading = true;
		this.abortController = new AbortController();

		const uploadBtn = this.shadowRoot.querySelector( '#uploadBtn' ) as HTMLButtonElement;
		const abortBtn = this.shadowRoot.querySelector( '#abortBtn' ) as HTMLButtonElement;

		if ( uploadBtn ) {
			uploadBtn.disabled = true;
			uploadBtn.textContent = 'Uploading...';
		}

		if ( abortBtn ) {
			abortBtn.style.display = 'inline-block';
		}

		try {
			for ( const file of pendingFiles ) {
				// Check if upload was aborted
				if ( this.abortController.signal.aborted ) {
					break;
				}
				await this.uploadFile( file );
			}

			// All uploads complete
			this.dispatchEvent(
				new CustomEvent( 'uploadcomplete', {
					detail: Array.from( this.files.values() ),
					bubbles: true,
					composed: true,
				} ),
			);

			// Call callback if provided
			if ( this.config.onuploadcomplete ) {
				this.config.onuploadcomplete( Array.from( this.files.values() ) );
			}
		} catch ( error ) {
			// Only log non-abort errors
			if ( error instanceof Error && error.message !== 'Upload aborted by user' ) {
				console.error( 'Upload error:', error );
			}
		} finally {
			this.isUploading = false;
			if ( uploadBtn ) {
				uploadBtn.disabled = false;
				uploadBtn.textContent = 'Upload Files';
			}
			if ( abortBtn ) {
				abortBtn.style.display = 'none';
			}
		}
	}

	/**
	 * Aborts all pending and uploading files
	 */
	private async abortAllUploads () : Promise<void> {
		// Trigger abort signal to stop ongoing fetch requests
		if ( this.abortController ) {
			this.abortController.abort();
		}

		const filesToAbort = Array.from( this.files.values() ).filter(
			( f ) => f.status === 'pending' || f.status === 'uploading',
		);

		if ( filesToAbort.length === 0 ) return;

		const headers : HeadersInit = {
			'Content-Type': 'application/json',
		};

		if ( this.config.authToken ) {
			headers['Authorization'] = `Bearer ${this.config.authToken}`;
		}

		for ( const file of filesToAbort ) {
			// If upload was initiated, abort it on the server
			if ( file.uploadId && file.key ) {
				try {
					// Remove trailing slash from serverURL if present
					const serverUrl = this.config.serverURL.replace( /\/$/, '' );
					await fetch( `${serverUrl}/api/upload/abort`, {
						method: 'POST',
						mode: 'cors',
						headers,
						body: JSON.stringify( {
							uploadId: file.uploadId,
							key: file.key,
						} ),
					} );
				} catch ( error ) {
					console.error( `Failed to abort upload for ${file.file.name}:`, error );
				}
			}

			// Update file status
			file.status = 'aborted';
			file.error = 'Upload aborted by user';
			this.updateFileCard( file.id );
		}

		// Dispatch abort event
		this.dispatchEvent(
			new CustomEvent( 'uploadaborted', {
				detail: filesToAbort,
				bubbles: true,
				composed: true,
			} ),
		);

		// Reset upload state
		this.isUploading = false;
		const uploadBtn = this.shadowRoot.querySelector( '#uploadBtn' ) as HTMLButtonElement;
		const abortBtn = this.shadowRoot.querySelector( '#abortBtn' ) as HTMLButtonElement;

		if ( uploadBtn ) {
			uploadBtn.disabled = false;
			uploadBtn.textContent = 'Upload Files';
		}

		if ( abortBtn ) {
			abortBtn.style.display = 'none';
		}
	}

	/**
	 * Updates a single file card in the DOM
	 */
	private updateFileCard ( fileId : string ) : void {
		const file = this.files.get( fileId );
		if ( !file ) return;

		const card = this.shadowRoot.querySelector( `[data-file-id="${fileId}"]` ) as HTMLElement;
		if ( !card ) return;

		const progressBar = card.querySelector( '.progress-bar' ) as HTMLElement;
		const progressText = card.querySelector( '.progress-text' ) as HTMLElement;
		const statusDiv = card.querySelector( '.status' ) as HTMLElement;

		if ( progressBar ) {
			progressBar.style.width = `${file.progress}%`;

			// Color based on status
			if ( file.status === 'completed' ) {
				progressBar.style.backgroundColor = '#22c55e'; // green
			} else if ( file.status === 'error' ) {
				progressBar.style.backgroundColor = '#ef4444'; // red
			} else if ( file.status === 'aborted' ) {
				progressBar.style.backgroundColor = '#f59e0b'; // orange
			} else {
				progressBar.style.backgroundColor = 'var(--color-primary)';
			}
		}

		if ( progressText ) {
			progressText.textContent = `${Math.round( file.progress )}%`;
		}

		if ( statusDiv && file.error ) {
			statusDiv.textContent = file.error;
			statusDiv.style.display = 'block';
		}
	}

	/**
	 * Renders all file cards
	 */
	private renderFileCards () : void {
		const container = this.shadowRoot.querySelector( '#fileCardsContainer' );
		if ( !container ) return;

		if ( this.files.size === 0 ) {
			container.innerHTML = '';
			return;
		}

		container.innerHTML = Array.from( this.files.values() ).map( ( file ) => `
      <div class="file-card" data-file-id="${file.id}">
        <button class="remove-btn" data-file-id="${file.id}">×</button>
        ${file.preview ? `<div class="preview"><img src="${file.preview}" alt="Preview"></div>` : '<div class="preview no-preview">📄</div>'}
        <div class="file-info">
          <div class="file-name" title="${file.file.name}">${file.file.name}</div>
          <div class="file-size">${this.formatBytes( file.file.size )}</div>
        </div>
        <div class="progress-container">
          <div class="progress-bar-bg">
            <div class="progress-bar" style="width: ${file.progress}%; background-color: ${
			file.status === 'completed' ? '#22c55e' : file.status === 'error' ? '#ef4444' : 'var(--color-primary)'
		}"></div>
          </div>
          <div class="progress-text">${Math.round( file.progress )}%</div>
        </div>
        ${file.error ? `<div class="status error">${file.error}</div>` : ''}
      </div>
    ` ).join( '' );

		// Bind remove button events
		const removeButtons = container.querySelectorAll( '.remove-btn' );
		removeButtons.forEach( ( btn ) => {
			btn.addEventListener( 'click', ( e ) => {
				e.stopPropagation();
				const fileId = ( btn as HTMLElement ).dataset.fileId;
				if ( fileId ) this.removeFile( fileId );
			} );
		} );

		// Show/hide upload button
		const uploadBtn = this.shadowRoot.querySelector( '#uploadBtn' ) as HTMLButtonElement;
		if ( uploadBtn ) {
			const hasPendingFiles = Array.from( this.files.values() ).some( ( f ) => f.status === 'pending' );
			uploadBtn.style.display = hasPendingFiles ? 'block' : 'none';
		}
	}

	/**
	 * Binds event listeners
	 */
	private bindEvents () : void {
		const uploadZone = this.shadowRoot.querySelector( '#uploadZone' ) as HTMLElement;
		const fileInput = this.shadowRoot.querySelector( '#fileInput' ) as HTMLInputElement;
		const browseBtn = this.shadowRoot.querySelector( '#browseBtn' ) as HTMLButtonElement;
		const uploadBtn = this.shadowRoot.querySelector( '#uploadBtn' ) as HTMLButtonElement;
		const abortBtn = this.shadowRoot.querySelector( '#abortBtn' ) as HTMLButtonElement;

		// Click to browse
		browseBtn?.addEventListener( 'click', () => fileInput?.click() );

		// Drag and drop
		uploadZone?.addEventListener( 'dragover', ( e ) => {
			e.preventDefault();
			uploadZone.classList.add( 'drag-over' );
		} );

		uploadZone?.addEventListener( 'dragleave', () => {
			uploadZone.classList.remove( 'drag-over' );
		} );

		uploadZone?.addEventListener( 'drop', ( e ) => {
			e.preventDefault();
			uploadZone.classList.remove( 'drag-over' );
			if ( e.dataTransfer?.files ) {
				this.addFiles( e.dataTransfer.files );
			}
		} );

		// File input change
		fileInput?.addEventListener( 'change', ( e ) => {
			const files = ( e.target as HTMLInputElement ).files;
			if ( files ) {
				this.addFiles( files );
				// Reset input so same file can be added again
				fileInput.value = '';
			}
		} );

		// Upload button
		uploadBtn?.addEventListener( 'click', () => this.startUpload() );

		// Abort button
		abortBtn?.addEventListener( 'click', () => this.abortAllUploads() );
	}

	/**
	 * Renders the component
	 */
	private render () : void {
		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          width: 100%;
        }

        .upload-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .upload-zone:hover {
          border-color: #4CAF50;
          background: #f0f9f0;
        }

        .upload-zone.drag-over {
          border-color: #4CAF50;
          background: #e8f5e9;
        }

        .upload-zone-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .upload-text {
          font-size: 18px;
          margin-bottom: 8px;
          color: #333;
        }

        .upload-hint {
          font-size: 14px;
          color: #666;
        }

        .browse-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 16px;
          transition: background 0.3s ease;
          pointer-events: auto;
        }

        .browse-btn:hover {
          background: #45a049;
        }

        input[type="file"] {
          display: none;
        }

        .file-cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }

        .file-card {
          position: relative;
          width: 200px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }

        .file-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.3s ease;
          z-index: 1;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 1);
        }

        .preview {
          width: 100%;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview.no-preview {
          font-size: 48px;
        }

        .file-info {
          margin-bottom: 8px;
        }

        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }

        .file-size {
          font-size: 12px;
          color: #666;
        }

        .progress-container {
          margin-top: 8px;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-bar {
          height: 100%;
          background: var(--color-primary, #4CAF50);
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
          text-align: center;
        }

        .status {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
          display: none;
        }

        .status.error {
          display: block;
        }

        .upload-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.3s ease;
          display: none;
        }

        .upload-btn:hover:not(:disabled) {
          background: #45a049;
        }

        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .abort-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 24px;
          margin-left: 12px;
          transition: background 0.3s ease;
          display: none;
        }

        .abort-btn:hover {
          background: #dc2626;
        }

        .buttons-container {
          display: flex;
          align-items: center;
        }

        /* Compact Mode Styles */
        .container.compact .upload-zone {
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .container.compact .upload-icon,
        .container.compact .upload-hint {
          display: none;
        }

        .container.compact .upload-text {
          font-size: 14px;
          margin-bottom: 0;
        }

        .container.compact .browse-btn {
          margin-top: 0;
          padding: 6px 12px;
          font-size: 14px;
        }

        .container.compact .file-cards-container {
          margin-top: 12px;
        }

        .container.compact .file-card {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 8px;
          height: auto;
        }

        .container.compact .preview {
          display: none !important;
        }

        .container.compact .file-info {
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 0 0 auto;
        }

        .container.compact .file-name {
          margin-bottom: 0;
          max-width: 150px;
        }

        .container.compact .progress-container {
          margin-top: 0;
          flex: 1;
          margin-left: 12px;
          margin-right: 32px;
        }

        .container.compact .remove-btn {
          top: 50%;
          transform: translateY(-50%);
        }
      </style>

      <div class="container">
        <div class="upload-zone" id="uploadZone">
          <input type="file" id="fileInput" multiple>
          <div class="upload-zone-content">
            <div class="upload-icon">📁</div>
            <div class="upload-text">${this.config.labelDropFiles || 'Drop files here'}</div>
            <div class="upload-hint">or</div>
            <button class="browse-btn" id="browseBtn">${this.config.labelBrowse || 'Browse Files'}</button>
          </div>
        </div>

        <div class="file-cards-container" id="fileCardsContainer"></div>

        <div class="buttons-container">
          <button class="upload-btn" id="uploadBtn">Upload Files</button>
          <button class="abort-btn" id="abortBtn">Abort Upload</button>
        </div>
      </div>
    `;
	}
}

/**
 * Defines the custom element if not already defined
 */
export const defineChunkUploader = ( tagName = 'liwe3-chunk-uploader' ) : void => {
	if ( typeof window !== 'undefined' && !customElements.get( tagName ) ) {
		customElements.define( tagName, ChunkUploaderElement );
	}
};

// Auto-register with default tag name
if ( typeof window !== 'undefined' ) {
	defineChunkUploader();
}
