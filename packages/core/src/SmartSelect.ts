/**
 * SmartSelect Web Component
 * A customizable select dropdown with search, multi-select, and keyboard navigation
 */

export interface SelectOption {
  value: string;
  label: string;
}

export class SmartSelectElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private isOpen: boolean = false;
  private selectedOptions: SelectOption[] = [];
  private filteredOptions: SelectOption[] = [];
  private focusedIndex: number = -1;
  private searchValue: string = '';
  private keyboardNavigating: boolean = false;
  private keyboardTimer?: number;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Make component focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.render();
    this.bindEvents();
  }

  static get observedAttributes(): string[] {
    return ['multiple', 'searchable', 'placeholder', 'disabled', 'value', 'options'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) {
      if (name === 'options') {
        this.filteredOptions = [...this.options];
      }
      this.render();
    }
  }

  get multiple(): boolean {
    return this.hasAttribute('multiple');
  }

  set multiple(value: boolean) {
    if (value) {
      this.setAttribute('multiple', '');
    } else {
      this.removeAttribute('multiple');
    }
  }

  get searchable(): boolean {
    return this.hasAttribute('searchable');
  }

  set searchable(value: boolean) {
    if (value) {
      this.setAttribute('searchable', '');
    } else {
      this.removeAttribute('searchable');
    }
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || 'Select an option';
  }

  set placeholder(value: string) {
    this.setAttribute('placeholder', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get value(): string | string[] {
    if (this.multiple) {
      return this.selectedOptions.map(opt => opt.value);
    }
    return this.selectedOptions.length > 0 ? this.selectedOptions[0].value : '';
  }

  set value(val: string | string[]) {
    if (this.multiple && Array.isArray(val)) {
      this.selectedOptions = this.options.filter(opt => val.includes(opt.value));
    } else {
      const option = this.options.find(opt => opt.value === val);
      this.selectedOptions = option ? [option] : [];
    }
    this.render();
  }

  get options(): SelectOption[] {
    const optionsAttr = this.getAttribute('options');
    if (optionsAttr) {
      try {
        return JSON.parse(optionsAttr);
      } catch (e) {
        console.error('Invalid options format:', e);
        return [];
      }
    }
    return [];
  }

  set options(opts: SelectOption[]) {
    this.setAttribute('options', JSON.stringify(opts));
  }

  /**
   * Opens the dropdown
   */
  open(): void {
    if (this.disabled) return;
    this.isOpen = true;
    this.focusedIndex = -1;
    if (this.options.length > 0) {
      this.filteredOptions = [...this.options];
    }
    this.render();

    // Update dropdown position based on viewport
    this._updateDropdownPosition();

    // Focus search input if searchable
    if (this.searchable) {
      requestAnimationFrame(() => {
        const searchInput = this.shadowRoot.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      });
    }

    this.dispatchEvent(new CustomEvent('open'));
  }

  /**
   * Closes the dropdown
   */
  close(): void {
    this.isOpen = false;
    this.focusedIndex = -1;
    this.searchValue = '';

    // Reset filtered options when closing
    if (this.searchable && this.options.length > 0) {
      this.filteredOptions = [...this.options];
    }

    // Clear any inline positioning styles
    const dropdown = this.shadowRoot.querySelector('.dropdown') as HTMLElement;
    if (dropdown) {
      dropdown.style.top = '';
      dropdown.style.left = '';
      dropdown.style.width = '';
      dropdown.style.maxHeight = '';
    }

    this.render();
    this.dispatchEvent(new CustomEvent('close'));
  }

  /**
   * Toggles the dropdown open/closed state
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Selects an option by its value
   */
  selectOption(value: string): void {
    const option = this.options.find(opt => opt.value === value);
    if (!option) return;

    if (this.multiple) {
      if (!this.selectedOptions.find(opt => opt.value === value)) {
        this.selectedOptions.push(option);
      }
    } else {
      this.selectedOptions = [option];
      this.close();
    }

    this.render();
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
  }

  /**
   * Deselects an option by its value
   */
  deselectOption(value: string): void {
    this.selectedOptions = this.selectedOptions.filter(opt => opt.value !== value);
    this.render();
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
  }

  /**
   * Returns an array of currently selected options
   */
  getSelectedOptions(): SelectOption[] {
    return [...this.selectedOptions];
  }

  /**
   * Sets the options for the select component
   */
  setOptions(options: SelectOption[]): void {
    this.options = options;
    this.filteredOptions = [...options];
    this.selectedOptions = [];
    this.render();
  }

  /**
   * Handles search functionality
   */
  private handleSearch(query: string): void {
    this.searchValue = query;
    this.filteredOptions = this.options.filter(option =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    this.focusedIndex = -1;
    this.render();
    this.dispatchEvent(new CustomEvent('search', { detail: { query } }));
  }

  /**
   * Updates the visual focus state without full re-render
   */
  private updateFocusedOption(): void {
    const options = this.shadowRoot.querySelectorAll('.option');

    // Remove focused class from all options
    options.forEach(option => option.classList.remove('focused'));

    // Add focused class to current option
    if (this.focusedIndex >= 0 && this.focusedIndex < options.length) {
      options[this.focusedIndex].classList.add('focused');
    }

    this.scrollToFocusedOption();
  }

  /**
   * Scrolls the focused option into view
   */
  private scrollToFocusedOption(): void {
    if (this.focusedIndex < 0) return;

    requestAnimationFrame(() => {
      const dropdown = this.shadowRoot.querySelector('.dropdown') as HTMLElement;
      const focusedOption = this.shadowRoot.querySelector('.option.focused') as HTMLElement;

      if (dropdown && focusedOption) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const optionRect = focusedOption.getBoundingClientRect();

        // Check if option is above visible area
        if (optionRect.top < dropdownRect.top) {
          dropdown.scrollTop -= (dropdownRect.top - optionRect.top);
        }
        // Check if option is below visible area
        else if (optionRect.bottom > dropdownRect.bottom) {
          dropdown.scrollTop += (optionRect.bottom - dropdownRect.bottom);
        }
      }
    });
  }

  /**
   * Calculates the optimal dropdown position based on viewport constraints
   */
  private _calculateDropdownPosition(): { top: number; left: number; width: number; maxHeight: number } | null {
    const trigger = this.shadowRoot.querySelector('.select-trigger') as HTMLElement;
    if (!trigger) return null;

    const triggerRect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownMaxHeight = 200;
    const dropdownPadding = 10;
    const margin = 2;

    // Calculate available space
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    // Determine if dropdown should open upward
    const shouldOpenUpward = spaceBelow < dropdownMaxHeight + dropdownPadding && spaceAbove > spaceBelow;

    // Calculate dimensions
    const width = triggerRect.width;
    const left = Math.max(0, Math.min(triggerRect.left, viewportWidth - width));

    let top: number;
    let maxHeight: number;

    if (shouldOpenUpward) {
      // Position above the trigger
      maxHeight = Math.min(dropdownMaxHeight, spaceAbove - dropdownPadding);
      top = triggerRect.top - maxHeight - margin;
    } else {
      // Position below the trigger
      maxHeight = Math.min(dropdownMaxHeight, spaceBelow - dropdownPadding);
      top = triggerRect.bottom + margin;
    }

    return {
      top: Math.max(0, top),
      left,
      width,
      maxHeight: Math.max(100, maxHeight) // Ensure minimum height
    };
  }

  /**
   * Updates dropdown position using fixed positioning relative to viewport
   */
  private _updateDropdownPosition(): void {
    requestAnimationFrame(() => {
      const dropdown = this.shadowRoot.querySelector('.dropdown') as HTMLElement;
      if (!dropdown) return;

      const position = this._calculateDropdownPosition();
      if (!position) return;

      // Apply calculated position as inline styles
      dropdown.style.top = `${position.top}px`;
      dropdown.style.left = `${position.left}px`;
      dropdown.style.width = `${position.width}px`;
      dropdown.style.maxHeight = `${position.maxHeight}px`;
    });
  }

  /**
   * Handles keyboard navigation
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;

    // Prevent double execution if event has already been handled
    if ((event as any)._smartSelectHandled) return;
    (event as any)._smartSelectHandled = true;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.keyboardNavigating = true;
        clearTimeout(this.keyboardTimer);
        this.keyboardTimer = window.setTimeout(() => { this.keyboardNavigating = false; }, 100);

        if (!this.isOpen) {
          this.open();
        } else {
          // If searchable and search input is focused, move to first option
          const searchInput = this.shadowRoot.querySelector('.search-input') as HTMLInputElement;
          const isSearchFocused = this.searchable && searchInput === this.shadowRoot.activeElement;

          if (isSearchFocused) {
            this.focusedIndex = 0;
            searchInput.blur(); // Blur search input to allow normal navigation
            // Focus the component to ensure it receives keyboard events
            this.focus();
            this.updateFocusedOption();
            return;
          }
          // Navigate through options
          const newIndex = Math.min(this.focusedIndex + 1, this.filteredOptions.length - 1);
          this.focusedIndex = newIndex;
          this.updateFocusedOption();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.keyboardNavigating = true;
        clearTimeout(this.keyboardTimer);
        this.keyboardTimer = window.setTimeout(() => { this.keyboardNavigating = false; }, 100);

        if (this.isOpen) {
          // If at first option and searchable, focus search input
          if (this.focusedIndex === 0 && this.searchable) {
            this.focusedIndex = -1;
            this.updateFocusedOption();
            requestAnimationFrame(() => {
              const searchInput = this.shadowRoot.querySelector('.search-input') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
                searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
              }
            });
            return;
          }
          // If searchable and search input is focused, do nothing
          const searchInput = this.shadowRoot.querySelector('.search-input') as HTMLInputElement;
          const isSearchFocused = this.searchable && searchInput === this.shadowRoot.activeElement;

          if (isSearchFocused) {
            return;
          }
          // Navigate through options
          const newIndex = Math.max(this.focusedIndex - 1, -1);
          this.focusedIndex = newIndex;
          this.updateFocusedOption();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen && this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length) {
          this.selectOption(this.filteredOptions[this.focusedIndex].value);
        } else if (!this.isOpen) {
          this.open();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'Tab':
        this.close();
        break;
    }
  }

  /**
   * Binds all event listeners
   */
  private bindEvents(): void {
    // Listen for keydown events on both the component and shadow root
    const keydownHandler = this.handleKeydown.bind(this);
    this.addEventListener('keydown', keydownHandler);
    this.shadowRoot.addEventListener('keydown', keydownHandler as EventListener);

    // Use event delegation on the shadow root
    this.shadowRoot.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (target.closest('.remove-tag')) {
        const value = (target.closest('.remove-tag') as HTMLElement).dataset.value;
        if (value) this.deselectOption(value);
      } else if (target.closest('.option')) {
        const value = (target.closest('.option') as HTMLElement).dataset.value;
        if (value) this.selectOption(value);
      } else if (target.closest('.select-trigger')) {
        this.toggle();
      }
    });

    // Handle mouse hover on options to update focused index
    this.shadowRoot.addEventListener('mouseover', (e) => {
      // Don't interfere with keyboard navigation
      if (this.keyboardNavigating) return;

      const target = e.target as HTMLElement;
      if (target.closest('.option')) {
        const option = target.closest('.option') as HTMLElement;
        const options = Array.from(this.shadowRoot.querySelectorAll('.option'));
        const newFocusedIndex = options.indexOf(option);

        // Only update if the focused index actually changed
        if (this.focusedIndex !== newFocusedIndex) {
          // Remove focused class from current option
          const currentFocused = this.shadowRoot.querySelector('.option.focused');
          if (currentFocused) {
            currentFocused.classList.remove('focused');
          }

          // Add focused class to new option
          option.classList.add('focused');
          this.focusedIndex = newFocusedIndex;
        }
      }
    });

    // Handle mouse leaving dropdown to clear focus
    this.shadowRoot.addEventListener('mouseleave', (e) => {
      // Don't interfere with keyboard navigation
      if (this.keyboardNavigating) return;

      const target = e.target as HTMLElement;
      if (target.closest('.dropdown')) {
        const currentFocused = this.shadowRoot.querySelector('.option.focused');
        if (currentFocused) {
          currentFocused.classList.remove('focused');
        }
        this.focusedIndex = -1;
      }
    });

    // Handle search input
    this.shadowRoot.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains('search-input')) {
        this.handleSearch(target.value);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target as Node)) {
        this.close();
      }
    });

    // Update dropdown position on window resize or scroll
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this._updateDropdownPosition();
      }
    });

    window.addEventListener('scroll', () => {
      if (this.isOpen) {
        this._updateDropdownPosition();
      }
    }, true); // Use capture to catch all scroll events
  }

  /**
   * Renders the component
   */
  private render(): void {
    // Initialize filteredOptions if not set
    if (this.filteredOptions.length === 0 && this.options.length > 0) {
      this.filteredOptions = [...this.options];
    }

    // Remember if search input was focused before render
    const wasSearchFocused = this.shadowRoot.querySelector('.search-input') === this.shadowRoot.activeElement;

    const displayText = this.selectedOptions.length > 0
      ? (this.multiple
        ? `${this.selectedOptions.length} selected`
        : this.selectedOptions[0].label)
      : this.placeholder;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          min-width: 200px;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--font-size, 14px);
          outline: none;
        }

        :host(:focus) .select-trigger {
          border-color: var(--focus-color, #007bff);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        :host([disabled]) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .select-container {
          position: relative;
        }

        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--padding, 8px 12px);
          border: var(--border, 1px solid #ccc);
          border-radius: var(--border-radius, 4px);
          background: var(--background, white);
          cursor: pointer;
          min-height: 36px;
          box-sizing: border-box;
          color: #333;
        }

        .select-trigger:focus {
          outline: none;
          border-color: var(--focus-color, #007bff);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .select-trigger[disabled] {
          cursor: not-allowed;
        }

        .selected-content {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
          flex: 1;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: var(--tag-background, #e9ecef);
          border-radius: var(--tag-border-radius, 12px);
          font-size: 12px;
          color: var(--tag-color, #495057);
        }

        .remove-tag {
          cursor: pointer;
          color: var(--remove-color, #6c757d);
          font-weight: bold;
          font-size: 14px;
        }

        .remove-tag:hover {
          color: var(--remove-hover-color, #dc3545);
        }

        .arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid var(--arrow-color, #666);
          transition: transform 0.2s;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .dropdown {
          position: fixed;
          z-index: 99999;
          background: var(--dropdown-background, white);
          border: var(--dropdown-border, 1px solid #ccc);
          border-radius: var(--dropdown-border-radius, 4px);
          box-shadow: var(--dropdown-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
          max-height: 200px;
          overflow-y: auto;
          scroll-behavior: smooth;
          color: #333;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-bottom: 1px solid #eee;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .option {
          padding: 8px 12px;
          cursor: pointer;
          color: var(--option-color, #333);
          transition: background-color 0.2s;
        }

        .option:hover {
          background-color: var(--option-hover-background, #f8f9fa);
        }

        .option.focused {
          background-color: var(--option-focused-background, #007bff);
          color: var(--option-focused-color, white);
        }

        .option.selected {
          background-color: var(--option-selected-background, #e3f2fd);
          color: var(--option-selected-color, #1976d2);
        }

        .no-options {
          padding: 8px 12px;
          color: var(--no-options-color, #6c757d);
          font-style: italic;
        }
      </style>

      <div class="select-container">
        <div class="select-trigger" tabindex="-1">
          <div class="selected-content">
            ${this.multiple && this.selectedOptions.length > 0
              ? this.selectedOptions.map(option => `
                  <span class="tag">
                    ${option.label}
                    <span class="remove-tag" data-value="${option.value}">×</span>
                  </span>
                `).join('')
              : `<span>${displayText}</span>`
            }
          </div>
          <div class="arrow ${this.isOpen ? 'open' : ''}"></div>
        </div>

        ${this.isOpen ? `
          <div class="dropdown">
            ${this.searchable ? `
              <input
                type="text"
                class="search-input"
                placeholder="Search options..."
                value="${this.searchValue}"
              >
            ` : ''}

            ${this.filteredOptions.length > 0
              ? this.filteredOptions.map((option, index) => `
                  <div
                    class="option ${this.selectedOptions.find(selected => selected.value === option.value) ? 'selected' : ''} ${index === this.focusedIndex ? 'focused' : ''}"
                    data-value="${option.value}"
                  >
                    ${option.label}
                  </div>
                `).join('')
              : '<div class="no-options">No options available</div>'
            }
          </div>
        ` : ''}
      </div>
    `;

    // Re-focus search input if it was previously focused
    if (wasSearchFocused && this.searchable && this.isOpen) {
      requestAnimationFrame(() => {
        const searchInput = this.shadowRoot.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          // Restore cursor position to the end
          searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
        }
      });
    }
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineSmartSelect = (tagName: string = 'liwe3-select'): void => {
  if (typeof window !== 'undefined' && !window.customElements.get(tagName)) {
    customElements.define(tagName, SmartSelectElement);
  }
};

// Auto-register with default tag name
defineSmartSelect();

export { defineSmartSelect };
