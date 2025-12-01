# Toast Component

A notification system for displaying temporary messages with multiple styles and auto-dismiss functionality.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    <button onclick="showToast('info')">Show Info</button>
    <button onclick="showToast('success')">Show Success</button>
    <button onclick="showToast('warning')">Show Warning</button>
    <button onclick="showToast('error')">Show Error</button>
  </div>
  
  <div id="toast-container" style="position: relative; height: 300px; margin-top: 20px; border: 1px dashed #ccc; overflow: hidden;">
    <!-- Toasts will appear here -->
  </div>
</div>

<script>
  function showToast(type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('liwe3-toast');
    
    toast.setAttribute('type', type);
    toast.setAttribute('title', type.charAt(0).toUpperCase() + type.slice(1));
    toast.setAttribute('message', 'This is a ' + type + ' message.');
    toast.setAttribute('timer', '3000');
    
    toast.style.position = 'absolute';
    toast.style.top = '20px';
    toast.style.right = '20px';
    
    container.appendChild(toast);
    
    toast.addEventListener('close', () => {
      toast.remove();
    });
  }
</script>

## Usage

```html
<liwe3-toast
  type="success"
  title="Success"
  message="Operation completed successfully"
  timer="5000"
></liwe3-toast>
```
