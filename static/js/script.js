document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.querySelector(".chat-box");
  const messageInput = document.querySelector("#message-input");
  const sendBtn = document.querySelector("#send-btn");

  function styleCodeBlock(code, language) {
    // Function to apply styling to code blocks
    return `<pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>${language}</span><button class="flex gap-1 items-center copy-code-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-${language}">${code}</code></div></div></pre>`;
  }

  function escapeHtml(content) {
    const htmlEscapeTable = {
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
      ">": "&gt;",
      "<": "&lt;",
    };
    return content.replace(/[&"'<>]/g, char => htmlEscapeTable[char]);
  }

  function sendMessage() {
    const htmlContent = document.getElementById('html-content').value;
    // Burada htmlContent değerini modelle iletebilirsiniz
    console.log(htmlContent);
  }

  function addMessage(message, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", isUser ? "user-message" : "bot-message");

    const codeBlockRegex = /```([a-z]+)\n([\s\S]*?)```/gm;
    let match;
    let lastIndex = 0;
    let formattedMessage = '';

    while ((match = codeBlockRegex.exec(message)) !== null) {
      formattedMessage += escapeHtml(message.substring(lastIndex, match.index));
      const language = match[1];
      const code = match[2].trim();
      formattedMessage += styleCodeBlock(hljs.highlight(code, { language }).value, language);
      lastIndex = match.index + match[0].length;
    }

    formattedMessage += escapeHtml(message.substring(lastIndex));

    const displayMessage = isUser ? `<p>${formattedMessage}</p>` : formattedMessage;
    msgDiv.innerHTML = displayMessage;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  sendBtn.addEventListener("click", function() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true);
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
      .then(response => response.json())
      .then(data => {
        addMessage(data.answer, false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      messageInput.value = "";
      messageInput.style.height = '24px';
      currentRow = 1;
    }
  });

  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendBtn.click();
      e.preventDefault();
    }
  });

  messageInput.addEventListener('input', function() {
    this.style.height = '24px'; 
    const totalHeight = this.scrollHeight;
  
    const lineHeight = 24;
    const newLines = (this.value.match(/\n/g) || []).length;
    
    let overflowedContentHeight = totalHeight - lineHeight; 

    if(this.scrollHeight <= this.clientHeight){
      overflowedContentHeight = 0;
    }
  
    let newHeight = lineHeight + Math.max(newLines, overflowedContentHeight / lineHeight) * lineHeight;
    this.style.height = `${newHeight}px`;
  });

  function copyToClipboard(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        console.log('Code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Code copied to clipboard using fallback!');
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('message')) {
            const copyButtons = node.querySelectorAll('.copy-code-button');
            copyButtons.forEach(btn => {
              btn.addEventListener('click', function(event) {
                const codeToCopy = btn.parentNode.nextElementSibling.querySelector('code').innerText;
                copyToClipboard(codeToCopy);

                const originalText = btn.innerText;
                btn.innerText = 'Copied!';

                setTimeout(function() {
                  btn.innerText = originalText; // Yarım saniye sonra butonun metnini orijinaline çevir
                }, 500);
              });
            });
          }
        });
      }
    });
  });

  observer.observe(chatBox, { childList: true });

  window.addEventListener('load', (event) => {
  messageInput.focus();
  });
});