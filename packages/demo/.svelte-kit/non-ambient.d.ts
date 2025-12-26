
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/ai-markdown-editor" | "/ai-text-editor" | "/checklist" | "/chunk-uploader" | "/container-box" | "/date-selector" | "/dialog" | "/drawer" | "/markdown-preview" | "/popover-menu" | "/resizable-cropper" | "/smart-select" | "/toast" | "/tree-view";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/ai-markdown-editor": Record<string, never>;
			"/ai-text-editor": Record<string, never>;
			"/checklist": Record<string, never>;
			"/chunk-uploader": Record<string, never>;
			"/container-box": Record<string, never>;
			"/date-selector": Record<string, never>;
			"/dialog": Record<string, never>;
			"/drawer": Record<string, never>;
			"/markdown-preview": Record<string, never>;
			"/popover-menu": Record<string, never>;
			"/resizable-cropper": Record<string, never>;
			"/smart-select": Record<string, never>;
			"/toast": Record<string, never>;
			"/tree-view": Record<string, never>
		};
		Pathname(): "/" | "/ai-markdown-editor" | "/ai-markdown-editor/" | "/ai-text-editor" | "/ai-text-editor/" | "/checklist" | "/checklist/" | "/chunk-uploader" | "/chunk-uploader/" | "/container-box" | "/container-box/" | "/date-selector" | "/date-selector/" | "/dialog" | "/dialog/" | "/drawer" | "/drawer/" | "/markdown-preview" | "/markdown-preview/" | "/popover-menu" | "/popover-menu/" | "/resizable-cropper" | "/resizable-cropper/" | "/smart-select" | "/smart-select/" | "/toast" | "/toast/" | "/tree-view" | "/tree-view/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}