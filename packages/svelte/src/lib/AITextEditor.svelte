<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value?: string;
		apiKey?: string;
		suggestionDelay?: number;
		systemPrompt?: string;
		apiEndpoint?: string;
		modelName?: string;
		placeholder?: string;

		onbeforesuggestion?: (data: any) => boolean;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		apiKey = '',
		suggestionDelay = 3000,
		systemPrompt = $bindable(
			"You are a helpful writing assistant. Continue the user's text naturally and coherently. Provide 1-3 sentences that would logically follow their writing. Keep the same tone and style. Do not repeat what they've already written."
		),
		apiEndpoint = 'https://api.openai.com/v1/chat/completions',
		modelName = 'gpt-3.5-turbo',
		placeholder = 'Start writing your markdown text here...',

		onbeforesuggestion,
		onchange
	} = $props();

	let elementRef: HTMLElement;
	let webComponent: any;

	/**
	 * Updates the web component property and syncs with Svelte state
	 */
	const updateWebComponentProperty = (
		propertyName: string,
		newValue: any,
		setterMethod?: string
	) => {
		if (!webComponent) return;

		const method =
			setterMethod || `set${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}`;
		if (typeof webComponent[method] === 'function') {
			webComponent[method](newValue);
		} else if (propertyName in webComponent) {
			webComponent[propertyName] = newValue;
		}
	};

	/**
	 * Syncs all props with the web component
	 */
	const syncAllProps = () => {
		if (!webComponent) return;

		updateWebComponentProperty('apiKey', apiKey);
		updateWebComponentProperty('suggestionDelay', suggestionDelay);
		updateWebComponentProperty('systemPrompt', systemPrompt);
		updateWebComponentProperty('apiEndpoint', apiEndpoint);
		updateWebComponentProperty('modelName', modelName);

		// Set initial text value
		if (value && webComponent.getText() !== value) {
			webComponent.setText(value);
		}

		// Set placeholder
		const textarea = webComponent.shadowRoot?.getElementById('editor');
		if (textarea && placeholder) {
			textarea.placeholder = placeholder;
		}
	};

	$effect(() => {
		if (webComponent && webComponent.getText() !== value) {
			webComponent.setText(value);
		}
	});

	$effect(() => {
		if (webComponent) {
			const textarea = webComponent.shadowRoot?.getElementById('editor');
			if (textarea && placeholder) {
				textarea.placeholder = placeholder;
			}
		}
	});

	onMount(async () => {
		// Dynamically import the web component
		await import('@liwe3/webcomponents/ai-text-editor');

		// Get reference to the web component
		webComponent = elementRef;

		// Sync all initial props
		syncAllProps();

		// Listen for changes from the web component
		const handleChange = (event: CustomEvent) => {
			const newValue = event.detail.value;
			if (newValue !== value) {
				value = newValue;
				onchange?.(newValue);
			}
		};

		// Forward beforeSuggestion event and allow parent to cancel
		const handleBeforeSuggestion = (event: CustomEvent) => {
			const cancel = onbeforesuggestion ? onbeforesuggestion(event.detail) : false;

			// propagate cancellation back to the underlying web component
			if (cancel) event.preventDefault();
		};

		webComponent.addEventListener('change', handleChange);
		webComponent.addEventListener('beforeSuggestion', handleBeforeSuggestion as EventListener);

		// Cleanup
		return () => {
			webComponent?.removeEventListener('change', handleChange);
			webComponent?.removeEventListener(
				'beforeSuggestion',
				handleBeforeSuggestion as EventListener
			);
		};
	});

	// Public methods to expose web component functionality
	export const setText = (text: string) => {
		value = text;
		webComponent?.setText(text);
	};

	// Expose setContext to parent components
	export const setContext = (context: string) => {
		webComponent?.setContext(context);
	};

	// Expose setSystemPrompt to allow changing the system prompt dynamically
	export const setSystemPrompt = (prompt: string) => {
		systemPrompt = prompt;
		webComponent?.setSystemPrompt?.(prompt);
	};
</script>

<liwe3-ai-text-editor bind:this={elementRef}></liwe3-ai-text-editor>
