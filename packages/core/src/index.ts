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

// Convenience function to register all components at once
export const defineAllComponents = (): void => {
  if (typeof window !== 'undefined') {
    import('./SmartSelect').then(({ defineSmartSelect }) => defineSmartSelect());
    import('./AITextEditor').then(({ defineAITextEditor }) => defineAITextEditor());
  }
};
