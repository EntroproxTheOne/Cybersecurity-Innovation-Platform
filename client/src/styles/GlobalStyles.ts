import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--color-background, #0a0a0a);
    color: var(--color-text, #ffffff);
    line-height: 1.6;
    overflow-x: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* CSS Custom Properties */
  :root {
    --color-primary: #00d4ff;
    --color-secondary: #0099cc;
    --color-background: #0a0a0a;
    --color-surface: #1a1a2e;
    --color-text: #ffffff;
    --color-text-secondary: #b0b0b0;
    --color-border: #333333;
    --color-success: #28a745;
    --color-warning: #ffc107;
    --color-error: #dc3545;
    --color-info: #17a2b8;

    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;

    /* Border Radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Transitions */
    --transition-fast: 0.15s ease-in-out;
    --transition-normal: 0.3s ease-in-out;
    --transition-slow: 0.5s ease-in-out;

    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
  }

  /* Light theme overrides */
  [data-theme="light"] {
    --color-background: #ffffff;
    --color-surface: #f8f9fa;
    --color-text: #212529;
    --color-text-secondary: #6c757d;
    --color-border: #dee2e6;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-surface);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-secondary);
  }

  /* Selection */
  ::selection {
    background-color: var(--color-primary);
    color: var(--color-background);
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  /* Link styles */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--color-secondary);
  }

  /* Input styles */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: var(--spacing-sm);
  }

  .gap-md {
    gap: var(--spacing-md);
  }

  .gap-lg {
    gap: var(--spacing-lg);
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }

  .min-h-screen {
    min-height: 100vh;
  }

  .p-sm {
    padding: var(--spacing-sm);
  }

  .p-md {
    padding: var(--spacing-md);
  }

  .p-lg {
    padding: var(--spacing-lg);
  }

  .m-sm {
    margin: var(--spacing-sm);
  }

  .m-md {
    margin: var(--spacing-md);
  }

  .m-lg {
    margin: var(--spacing-lg);
  }

  .mb-sm {
    margin-bottom: var(--spacing-sm);
  }

  .mb-md {
    margin-bottom: var(--spacing-md);
  }

  .mb-lg {
    margin-bottom: var(--spacing-lg);
  }

  .mt-sm {
    margin-top: var(--spacing-sm);
  }

  .mt-md {
    margin-top: var(--spacing-md);
  }

  .mt-lg {
    margin-top: var(--spacing-lg);
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Loading animation */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid var(--color-border);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive utilities */
  @media (max-width: 768px) {
    .container {
      padding: 0 var(--spacing-sm);
    }
    
    .hidden-mobile {
      display: none;
    }
  }

  @media (min-width: 769px) {
    .hidden-desktop {
      display: none;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a, a:visited {
      text-decoration: underline;
    }
    
    .no-print {
      display: none !important;
    }
  }
`;

export default GlobalStyles;
