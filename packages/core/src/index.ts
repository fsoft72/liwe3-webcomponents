/**
 * @liwe3/webcomponents
 * A collection of reusable web components
 */

// Export SmartSelect
export {
  SmartSelectElement,
  defineSmartSelect,
  type SelectOption
} from './SmartSelect';

// Export AITextEditor
export {
  AITextEditorElement,
  defineAITextEditor,
  type AITextEditorConfig
} from './AITextEditor';

// Export Toast
export {
  ToastElement,
  defineToast,
  toastAdd,
  type ToastType,
  type ToastButton,
  type ToastConfig
} from './Toast';

// Export PopoverMenu
export {
  PopoverMenuElement,
  definePopoverMenu,
  type PopoverMenuItem,
  type PopoverMenuConfig
} from './PopoverMenu';

// Export DateSelector
export {
  DateSelectorElement,
  defineDateSelector,
  type DateRange
} from './DateSelector';

// Export TreeView
export {
  TreeViewElement,
  defineTreeView,
  type TreeNode
} from './TreeView';

// Export ContainerBox
export {
  ContainerBoxElement,
  defineContainerBox,
  type MenuPosition,
  type ContainerBoxConfig
} from './ContainerBox';

// Export Drawer
export {
  DrawerElement,
  defineDrawer,
  type DrawerDirection,
  type DrawerState,
  type DrawerConfig
} from './Drawer';

// Export ImageView
export * from './ImageView';

// Convenience function to register all components at once
export const defineAllComponents = (): void => {
  if ( typeof window !== 'undefined' ) {
    import( './SmartSelect' ).then( ( { defineSmartSelect } ) => defineSmartSelect() );
    import( './AITextEditor' ).then( ( { defineAITextEditor } ) => defineAITextEditor() );
    import( './Toast' ).then( ( { defineToast } ) => defineToast() );
    import( './PopoverMenu' ).then( ( { definePopoverMenu } ) => definePopoverMenu() );
    import( './DateSelector' ).then( ( { defineDateSelector } ) => defineDateSelector() );
    import( './TreeView' ).then( ( { defineTreeView } ) => defineTreeView() );
    import( './ContainerBox' ).then( ( { defineContainerBox } ) => defineContainerBox() );
    import( './Drawer' ).then( ( { defineDrawer } ) => defineDrawer() );
  }
};
