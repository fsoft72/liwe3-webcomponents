/**
 * @liwe3/webcomponents
 * A collection of reusable web components
 */

// Export SmartSelect
export {
	SmartSelectElement,
	defineSmartSelect,
	type SelectOption,
} from './SmartSelect';

// Export AITextEditor
export {
	AITextEditorElement,
	defineAITextEditor,
	type AITextEditorConfig,
} from './AITextEditor';

// Export Toast
export {
	ToastElement,
	defineToast,
	toastAdd,
	type ToastType,
	type ToastButton,
	type ToastConfig,
} from './Toast';

// Export Dialog
export {
	DialogElement,
	defineDialog,
	dialogAdd,
	type DialogButton,
	type DialogConfig,
} from './Dialog';

// Export PopoverMenu
export {
	PopoverMenuElement,
	definePopoverMenu,
	type PopoverMenuItem,
	type PopoverMenuConfig,
} from './PopoverMenu';

// Export DateSelector
export {
	DateSelectorElement,
	defineDateSelector,
	type DateRange,
} from './DateSelector';

// Export TreeView
export {
	TreeViewElement,
	defineTreeView,
	type TreeNode,
} from './TreeView';

// Export ContainerBox
export {
	ContainerBoxElement,
	defineContainerBox,
	type MenuPosition,
	type ContainerBoxConfig,
} from './ContainerBox';

// Export Drawer
export {
	DrawerElement,
	defineDrawer,
	type DrawerDirection,
	type DrawerState,
	type DrawerConfig,
} from './Drawer';

// Export ImageView
export * from './ImageView';

// Export ChunkUploader
export {
	ChunkUploaderElement,
	defineChunkUploader,
	type UploadedFile,
	type ChunkUploaderConfig,
} from './ChunkUploader';

// Export CheckList
export {
	CheckListElement,
	defineCheckList,
	type CheckListItem,
} from './CheckList';

// Export ButtonToolbar
export {
	ButtonToolbarElement,
	defineButtonToolbar,
	type ButtonToolbarItem,
	type ButtonToolbarGroup,
} from './ButtonToolbar';

// Export AIMarkdownEditor
export {
	AIMarkdownEditorElement,
	defineAIMarkdownEditor,
} from './AIMarkdownEditor';

// Export MarkdownPreview
export {
	MarkdownPreviewElement,
	defineMarkdownPreview,
} from './MarkdownPreview';

// Export ResizableCropper
export {
	ResizableCropperElement,
	defineResizableCropper,
	type ResizableCropperState,
	type ResizableCropEventDetail,
	type ResizableCropperValues,
	type ResizableCropperComponentState,
} from './ResizableCropper';

// Export ComicBalloon
export {
	ComicBalloonElement,
	defineComicBalloon,
	BalloonType,
	type HandlerPosition,
	type ContentChangeEvent,
	type HandlerMoveEvent,
} from './ComicBalloon';

// Export SortableContainer
export {
	SortableContainerElement,
	defineSortableContainer,
	type SortDirection,
	type HandlePosition,
	type SortableContainerConfig,
	type ReorgEventDetail,
} from './SortableContainer';

// Convenience function to register all components at once
export const defineAllComponents = () : void => {
	if ( typeof window !== 'undefined' ) {
		import( './SmartSelect' ).then( ( { defineSmartSelect } ) => defineSmartSelect() );
		import( './AITextEditor' ).then( ( { defineAITextEditor } ) => defineAITextEditor() );
		import( './AIMarkdownEditor' ).then( ( { defineAIMarkdownEditor } ) => defineAIMarkdownEditor() );
		import( './MarkdownPreview' ).then( ( { defineMarkdownPreview } ) => defineMarkdownPreview() );
		import( './Toast' ).then( ( { defineToast } ) => defineToast() );
		import( './Dialog' ).then( ( { defineDialog } ) => defineDialog() );
		import( './PopoverMenu' ).then( ( { definePopoverMenu } ) => definePopoverMenu() );
		import( './DateSelector' ).then( ( { defineDateSelector } ) => defineDateSelector() );
		import( './TreeView' ).then( ( { defineTreeView } ) => defineTreeView() );
		import( './ContainerBox' ).then( ( { defineContainerBox } ) => defineContainerBox() );
		import( './Drawer' ).then( ( { defineDrawer } ) => defineDrawer() );
		import( './ChunkUploader' ).then( ( { defineChunkUploader } ) => defineChunkUploader() );
		import( './CheckList' ).then( ( { defineCheckList } ) => defineCheckList() );
		import( './ButtonToolbar' ).then( ( { defineButtonToolbar } ) => defineButtonToolbar() );
		import( './ResizableCropper' ).then( ( { defineResizableCropper } ) => defineResizableCropper() );
		import( './ComicBalloon' ).then( ( { defineComicBalloon } ) => defineComicBalloon() );
		import( './SortableContainer' ).then( ( { defineSortableContainer } ) => defineSortableContainer() );
	}
};
