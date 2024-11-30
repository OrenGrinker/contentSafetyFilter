// Add this to your webpack entry points
console.log('Content script loaded'); // Debug log

function getAllText() {
  const text = Array.from(document.querySelectorAll('body, body *'))
    .filter(element => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    })
    .map(element => element.textContent)
    .join(' ');
  
  console.log('Found text:', text.substring(0, 100) + '...'); // Debug log
  return text;
}

// Test immediately
console.log('Running content script test...');
const text = getAllText();
console.log('Text length:', text.length);