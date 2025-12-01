<script lang="ts">
  // Home page for the demo app
</script>

<div class="home-container">
  <header class="hero">
    <h1>@liwe3/webcomponents Demo</h1>
    <p class="tagline">Interactive demos of Svelte 5 web component bindings</p>
  </header>

  <section class="intro">
    <p>
      This demo application showcases the <strong
        >@liwe3/webcomponents-svelte</strong
      > package, which provides Svelte 5 wrappers for framework-agnostic web components.
    </p>
    <p>
      All components use Svelte 5 runes for optimal reactivity and include full
      TypeScript support.
    </p>
  </section>

  <section class="components-grid">
    <a href="/smart-select" class="component-card">
      <div class="card-icon">🔽</div>
      <h2>SmartSelect</h2>
      <p>
        Advanced select dropdown with search, multi-select, and keyboard
        navigation. Perfect for forms with many options.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/ai-text-editor" class="component-card">
      <div class="card-icon">✍️</div>
      <h2>AITextEditor</h2>
      <p>
        Text editor with AI-powered continuation suggestions. Uses OpenAI API to
        help you write better content.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/toast" class="component-card">
      <div class="card-icon">🍞</div>
      <h2>Toast</h2>
      <p>
        Beautiful toast notifications with multiple types, custom icons, action
        buttons, and smooth animations. Perfect for user feedback.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/popover-menu" class="component-card">
      <div class="card-icon">📋</div>
      <h2>PopoverMenu</h2>
      <p>
        Customizable menu bar with nested submenus, hover interactions, and
        smart positioning. Perfect for application menus and context menus.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/date-selector" class="component-card">
      <div class="card-icon">📅</div>
      <h2>DateSelector</h2>
      <p>
        Beautiful date picker with single date and range selection modes.
        Features month navigation, year selection, and keyboard accessibility.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/drawer" class="component-card">
      <div class="card-icon">🗂️</div>
      <h2>Drawer</h2>
      <p>
        Responsive panel that expands, shrinks, or hides content with smooth
        transitions. Works horizontally or vertically with events.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/container-box" class="component-card">
      <div class="card-icon">📦</div>
      <h2>ContainerBox</h2>
      <p>
        A container that wraps elements and shows a menu on hover. Perfect for
        contextual actions on items.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/chunk-uploader" class="component-card">
      <div class="card-icon">☁️</div>
      <h2>ChunkUploader</h2>
      <p>
        Drag & drop uploader with multipart support for the Cloudflare Worker
        demo in <code>servers/upload-demo</code>. Handles large files with abort
        & resume helpers.
      </p>
      <span class="card-link">View Demo →</span>
    </a>

    <a href="/checklist" class="component-card">
      <div class="card-icon">✅</div>
      <h2>CheckList</h2>
      <p>
        A customizable checklist with progress bar, JSON support, and task management.
        Fully reactive with Svelte bindings.
      </p>
      <span class="card-link">View Demo →</span>
    </a>
  </section>

  <section class="features">
    <h2>Features</h2>
    <ul>
      <li>
        <strong>Svelte 5 Runes:</strong> Built with the latest Svelte reactivity
        primitives
      </li>
      <li>
        <strong>TypeScript Support:</strong> Full type safety and IntelliSense
      </li>
      <li>
        <strong>Framework Agnostic:</strong> Core components work in any framework
      </li>
      <li>
        <strong>Shadow DOM:</strong> Encapsulated styles with no conflicts
      </li>
      <li><strong>Accessible:</strong> Keyboard navigation and ARIA support</li>
    </ul>
  </section>

  <section class="getting-started">
    <h2>Getting Started</h2>
    <div class="code-block">
      <pre><code>pnpm add @liwe3/webcomponents @liwe3/webcomponents-svelte</code
        ></pre>
    </div>

    <div class="usage-example">
      <h3>Usage Example</h3>
      <div class="code-block">
        <pre><code
            >&lt;script&gt;
  import &#123; SmartSelect &#125; from '@liwe3/webcomponents-svelte';

  let value = $state();
  const options = [
    &#123; value: 'js', label: 'JavaScript' &#125;,
    &#123; value: 'ts', label: 'TypeScript' &#125;
  ];
&lt;/script&gt;

&lt;SmartSelect bind:value &#123;options&#125; searchable /&gt;</code
          ></pre>
      </div>
    </div>
  </section>
</div>

<style>
  .home-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    padding: 3rem 0;
    margin-bottom: 2rem;
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
    font-weight: 700;
  }

  .tagline {
    font-size: 1.3rem;
    color: #666;
    margin: 0;
  }

  .intro {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    margin-bottom: 3rem;
  }

  .intro p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0 0 1rem 0;
    color: #333;
  }

  .intro p:last-child {
    margin-bottom: 0;
  }

  .components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .component-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    display: block;
  }

  .component-card:hover {
    border-color: #4facfe;
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
    transform: translateY(-4px);
  }

  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .component-card h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .component-card p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .card-link {
    color: #4facfe;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .features {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    border: 2px solid #e0e0e0;
    margin-bottom: 3rem;
  }

  .features h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  .features ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .features li {
    padding: 0.75rem 0;
    font-size: 1.1rem;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }

  .features li:last-child {
    border-bottom: none;
  }

  .features strong {
    color: #4facfe;
  }

  .getting-started {
    margin-bottom: 3rem;
  }

  .getting-started h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  .getting-started h3 {
    font-size: 1.3rem;
    margin: 2rem 0 1rem 0;
    color: #333;
  }

  .code-block {
    background: #1e1e1e;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1rem;
  }

  .code-block pre {
    margin: 0;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.9rem;
  }

  .code-block code {
    color: #d4d4d4;
    line-height: 1.5;
  }

  .usage-example {
    margin-top: 2rem;
  }
</style>
