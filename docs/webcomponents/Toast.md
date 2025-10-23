# Toast

A notification system for displaying temporary messages with multiple styles, icons, buttons, and auto-dismiss functionality.

## Basic Usage

The recommended way to show toasts is using the `toastAdd()` helper function:

```html
<script type="module">
  import { toastAdd } from '@liwe3/webcomponents';

  toastAdd({
    title: 'Success!',
    text: 'Your changes have been saved.',
    type: 'success',
    duration: 5000
  });
</script>
```

## TypeScript Usage

```typescript
import { toastAdd, ToastConfig, ToastType } from '@liwe3/webcomponents';

const config: ToastConfig = {
  title: 'Notification',
  text: 'This is a notification message',
  type: 'info',
  duration: 5000,
  closable: true
};

const toast = toastAdd(config);
```

## Toast Types

The component supports four types, each with its own color scheme:

### Info (default)

```typescript
toastAdd({
  title: 'Information',
  text: 'This is an informational message.',
  type: 'info'
});
```

### Success

```typescript
toastAdd({
  title: 'Success',
  text: 'Operation completed successfully!',
  type: 'success'
});
```

### Warning

```typescript
toastAdd({
  title: 'Warning',
  text: 'Please review your input.',
  type: 'warning'
});
```

### Error

```typescript
toastAdd({
  title: 'Error',
  text: 'Something went wrong.',
  type: 'error'
});
```

## Configuration

### ToastConfig

```typescript
type ToastConfig = {
  title: string;           // Toast title (required)
  text: string;            // Toast message (required)
  type?: ToastType;        // 'info' | 'warning' | 'error' | 'success'
  icon?: string;           // URL to custom icon/image
  buttons?: ToastButton[]; // Action buttons
  closable?: boolean;      // Show close X button (default: true)
  duration?: number;       // Auto-dismiss in ms (default: 5000, 0 = no auto-dismiss)
  onClose?: () => void;    // Callback when toast closes
};
```

**Source:** `Toast.ts:13-22`

### ToastButton

```typescript
type ToastButton = {
  label: string;
  onClick: () => void;
};
```

**Source:** `Toast.ts:8-11`

## Features

### Custom Icons

Replace the default type icon with a custom image:

```typescript
toastAdd({
  title: 'New Message',
  text: 'You have a new message from John.',
  icon: '/path/to/custom-icon.png'
});
```

**Source:** `Toast.ts:90-102`

### Action Buttons

Add interactive buttons to your toasts. When buttons are present, `duration` is automatically set to 0 (no auto-dismiss):

```typescript
toastAdd({
  title: 'Confirm Action',
  text: 'Are you sure you want to delete this item?',
  type: 'warning',
  buttons: [
    {
      label: 'Cancel',
      onClick: () => {
        console.log('Cancelled');
      }
    },
    {
      label: 'Delete',
      onClick: () => {
        console.log('Deleted');
        // Perform delete action
      }
    }
  ]
});
```

**Source:** `Toast.ts:146-175`

### Auto-Dismiss with Progress Bar

Toasts automatically close after the specified duration. A progress bar shows the remaining time:

```typescript
toastAdd({
  title: 'Auto Close',
  text: 'This will close in 3 seconds',
  duration: 3000 // 3 seconds
});
```

Set `duration: 0` to disable auto-dismiss:

```typescript
toastAdd({
  title: 'Sticky Toast',
  text: 'This stays until manually closed',
  duration: 0
});
```

**Source:** `Toast.ts:244-256`, `Toast.ts:299-365`

### Pause on Hover

When you hover over a toast, the auto-dismiss timer pauses and resumes when you move away:

```typescript
toastAdd({
  title: 'Hover Me',
  text: 'The timer pauses when you hover',
  duration: 5000
});
```

**Source:** `Toast.ts:262-285`, `Toast.ts:314-365`

### Close Callback

Execute code when a toast closes:

```typescript
toastAdd({
  title: 'Notification',
  text: 'Important message',
  onClose: () => {
    console.log('Toast was closed');
    // Perform cleanup or follow-up actions
  }
});
```

**Source:** `Toast.ts:217-219`, `Toast.ts:234-236`

### Non-Closable Toasts

Hide the close button:

```typescript
toastAdd({
  title: 'System Message',
  text: 'Cannot be manually closed',
  closable: false,
  duration: 5000 // Will still auto-close
});
```

## Direct Element Usage

While `toastAdd()` is recommended, you can also use the element directly:

```html
<liwe3-toast id="myToast"></liwe3-toast>

<script type="module">
  import { ToastElement } from '@liwe3/webcomponents';

  const toast = document.getElementById('myToast');
  toast.show({
    title: 'Hello',
    text: 'This is a toast',
    type: 'info'
  });
</script>
```

## Methods

### `show(config: ToastConfig)`

Shows the toast with the given configuration.

**Parameters:**
- `config` - Toast configuration object

**Example:**
```typescript
toast.show({
  title: 'Success',
  text: 'Operation completed',
  type: 'success'
});
```

**Source:** `Toast.ts:154`

---

### `close()`

Closes the toast with animation.

**Example:**
```typescript
toast.close();
```

**Source:** `Toast.ts:183`

## Properties

All configuration options can be set as properties:

```typescript
const toast = document.createElement('liwe3-toast');
toast.title = 'My Title';
toast.text = 'My message';
toast.type = 'success';
toast.duration = 3000;
toast.closable = true;
```

## Events

### `close`

Fired when the toast closes (either manually or via auto-dismiss).

**Example:**
```typescript
toast.addEventListener('close', () => {
  console.log('Toast closed');
});
```

**Source:** `Toast.ts:216`, `Toast.ts:233`

## Toast Container

The `toastAdd()` function automatically creates a container element to hold all toasts. The container is:

- Fixed positioned at top-right of the screen
- On mobile (< 768px), it spans full width with side margins
- Toasts stack vertically with smooth transitions
- Each new toast is added to the bottom of the stack

**Container ID:** `liwe3-toast-container`

**Source:** `Toast.ts:691-733`

### Container Positioning

The default position is top-right. You can customize by targeting the container:

```css
#liwe3-toast-container {
  top: 20px !important;
  right: 20px !important;
  left: auto !important;
}

/* Bottom-right */
#liwe3-toast-container {
  top: auto !important;
  bottom: 20px !important;
  right: 20px !important;
}

/* Top-center */
#liwe3-toast-container {
  top: 20px !important;
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%);
}
```

## CSS Custom Properties

Customize the appearance using CSS variables:

```css
:root {
  /* General */
  --font-family: 'Your Font', sans-serif;
  --font-size: 14px;

  /* Toast Container */
  --toast-border-radius: 8px;
  --toast-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Success Type */
  --toast-success-background: #d4edda;
  --toast-success-border: #c3e6cb;
  --toast-success-icon: #155724;

  /* Error Type */
  --toast-error-background: #f8d7da;
  --toast-error-border: #f5c6cb;
  --toast-error-icon: #721c24;

  /* Warning Type */
  --toast-warning-background: #fff3cd;
  --toast-warning-border: #ffeaa7;
  --toast-warning-icon: #856404;

  /* Info Type */
  --toast-info-background: #d1ecf1;
  --toast-info-border: #bee5eb;
  --toast-info-icon: #0c5460;

  /* Content */
  --toast-title-color: #333;
  --toast-text-color: #555;

  /* Close Button */
  --toast-close-color: #666;
  --toast-close-hover-background: rgba(0, 0, 0, 0.1);
  --toast-close-hover-color: #333;

  /* Action Buttons */
  --toast-button-border: rgba(0, 0, 0, 0.1);
  --toast-button-border-color: #ccc;
  --toast-button-border-radius: 4px;
  --toast-button-background: white;
  --toast-button-color: #333;
  --toast-button-hover-background: #f8f9fa;
  --toast-button-hover-border-color: #999;
  --toast-button-active-background: #e9ecef;

  /* Progress Bar */
  --toast-progress-bar-color: rgba(0, 0, 0, 0.3);
}
```

**Source:** `Toast.ts:466-635`

## Animations

Toasts use smooth CSS animations:

- **Slide In:** Fades in and slides down from above (350ms)
- **Slide Out:** Fades out and slides up (300ms)
- **Collapse:** After slide-out, the toast collapses to 0 height (300ms)
- **Progress Bar:** Animates from 100% to 0% width over the duration

**Source:** `Toast.ts:483-512`, `Toast.ts:187-238`

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Toast Example</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 20px;
    }

    .demo-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    button {
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: #f0f0f0;
    }

    /* Custom toast styling */
    :root {
      --toast-border-radius: 12px;
      --toast-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <h1>Toast Notification Examples</h1>

  <div class="demo-buttons">
    <button onclick="showInfo()">Info Toast</button>
    <button onclick="showSuccess()">Success Toast</button>
    <button onclick="showWarning()">Warning Toast</button>
    <button onclick="showError()">Error Toast</button>
    <button onclick="showWithButtons()">Toast with Buttons</button>
    <button onclick="showCustomIcon()">Custom Icon</button>
    <button onclick="showSticky()">Sticky Toast</button>
    <button onclick="showMultiple()">Show Multiple</button>
  </div>

  <script type="module">
    import { toastAdd } from '@liwe3/webcomponents';

    window.showInfo = () => {
      toastAdd({
        title: 'Information',
        text: 'This is an informational message.',
        type: 'info',
        duration: 5000
      });
    };

    window.showSuccess = () => {
      toastAdd({
        title: 'Success!',
        text: 'Your changes have been saved successfully.',
        type: 'success',
        duration: 5000
      });
    };

    window.showWarning = () => {
      toastAdd({
        title: 'Warning',
        text: 'Please review your input before proceeding.',
        type: 'warning',
        duration: 5000
      });
    };

    window.showError = () => {
      toastAdd({
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        type: 'error',
        duration: 5000
      });
    };

    window.showWithButtons = () => {
      toastAdd({
        title: 'Confirm Action',
        text: 'Do you want to proceed with this action?',
        type: 'warning',
        buttons: [
          {
            label: 'Cancel',
            onClick: () => {
              toastAdd({
                title: 'Cancelled',
                text: 'Action was cancelled',
                type: 'info',
                duration: 3000
              });
            }
          },
          {
            label: 'Proceed',
            onClick: () => {
              toastAdd({
                title: 'Success',
                text: 'Action completed',
                type: 'success',
                duration: 3000
              });
            }
          }
        ]
      });
    };

    window.showCustomIcon = () => {
      toastAdd({
        title: 'Custom Icon',
        text: 'This toast has a custom icon',
        icon: 'https://via.placeholder.com/24',
        duration: 5000
      });
    };

    window.showSticky = () => {
      toastAdd({
        title: 'Sticky Toast',
        text: 'This toast will not auto-dismiss. Click X to close.',
        type: 'info',
        duration: 0
      });
    };

    window.showMultiple = () => {
      ['First', 'Second', 'Third'].forEach((text, index) => {
        setTimeout(() => {
          toastAdd({
            title: `Toast ${index + 1}`,
            text: `This is the ${text} toast`,
            type: ['info', 'success', 'warning'][index],
            duration: 5000
          });
        }, index * 500);
      });
    };
  </script>
</body>
</html>
```

## Best Practices

### Duration Guidelines

- **Success messages:** 3-5 seconds
- **Informational:** 5-7 seconds
- **Warnings:** 7-10 seconds or 0 (manual dismiss)
- **Errors:** 0 (manual dismiss) or very long duration
- **With buttons:** Always 0 (forced by component)

### Message Length

Keep toast messages concise:
- Title: 1-5 words
- Text: 1-2 sentences

For longer content, consider using a modal dialog instead.

### Action Buttons

- Limit to 2-3 buttons
- Use clear, action-oriented labels ("Save", "Delete", not "OK", "Yes")
- Always provide a way to dismiss without action

### Accessibility

The toasts are keyboard accessible:
- Close button can be focused and activated with Enter/Space
- Action buttons can be focused and activated
- Consider adding ARIA attributes for screen readers (not yet implemented)

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Related Components

- [SmartSelect](./SmartSelect.md)
- [AITextEditor](./AITextEditor.md)
- [PopoverMenu](./PopoverMenu.md)
