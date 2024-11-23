// src/utils/dom.ts
export function extractPageText(): string {
    const scripts = document.getElementsByTagName('script');
    Array.from(scripts).forEach(script => script.remove());
    
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const style = window.getComputedStyle(node.parentElement as Element);
          return (style.display !== 'none' && style.visibility !== 'hidden')
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );
  
    const textParts: string[] = [];
    let node: Node | null;
    
    while (node = walker.nextNode()) {
      textParts.push(node.textContent?.trim() || '');
    }
    
    return textParts.join(' ');
  }