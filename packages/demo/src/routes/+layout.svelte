<script lang="ts">
  import { page } from "$app/stores";
  import { Toasts } from "@liwe3/webcomponents-svelte";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/smart-select", label: "SmartSelect" },
    { href: "/ai-text-editor", label: "AITextEditor" },
    { href: "/toast", label: "Toast" },
    { href: "/tree-view", label: "TreeView" },
    { href: "/drawer", label: "Drawer" },
    { href: "/container-box", label: "ContainerBox" },
    { href: "/chunk-uploader", label: "ChunkUploader" },
  ];

  // Derived value for active page
  $: currentPath = $page.url.pathname;
</script>

<!-- Initialize Toast web component -->
<Toasts />

<div class="app">
  <nav class="navbar">
    <div class="nav-container">
      <a href="/" class="logo"> @liwe3/webcomponents </a>

      <ul class="nav-links">
        {#each navItems as item}
          <li>
            <a href={item.href} class:active={currentPath === item.href}>
              {item.label}
            </a>
          </li>
        {/each}
      </ul>

      <a
        href="https://github.com/fsoft72/liwe3-webcomponents"
        target="_blank"
        rel="noopener noreferrer"
        class="github-link"
      >
        GitHub
      </a>
    </div>
  </nav>

  <main class="main-content">
    <slot />
  </main>

  <footer class="footer">
    <div class="footer-content">
      <p>
        &copy; 2025
        <a href="https://www.os3.it" title="OS3 srl Website" target="_blank"
          >OS3 srl
        </a>. MIT License.
      </p>
      <p>
        Built with <a href="https://svelte.dev" target="_blank" rel="noopener"
          >Svelte 5</a
        >
        and
        <a href="https://kit.svelte.dev" target="_blank" rel="noopener"
          >SvelteKit</a
        >
      </p>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .navbar {
    background: #1a1a1a;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    text-decoration: none;
    font-family: "Monaco", "Menlo", monospace;
  }

  .logo:hover {
    color: #4facfe;
  }

  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
  }

  .nav-links a {
    color: #ccc;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    padding: 0.5rem 0;
    border-bottom: 2px solid transparent;
  }

  .nav-links a:hover {
    color: white;
  }

  .nav-links a.active {
    color: white;
    border-bottom-color: #4facfe;
  }

  .github-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid white;
    border-radius: 4px;
    transition: all 0.2s;
    font-weight: 500;
  }

  .github-link:hover {
    background: white;
    color: #1a1a1a;
  }

  .main-content {
    flex: 1;
    width: 100%;
  }

  .footer {
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    padding: 2rem 0;
    margin-top: 4rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }

  .footer-content p {
    margin: 0.5rem 0;
  }

  .footer-content a {
    color: #4facfe;
    text-decoration: none;
  }

  .footer-content a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-links {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
  }
</style>
