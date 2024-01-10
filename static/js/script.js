document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.querySelector(".chat-box");
  const messageInput = document.querySelector("#message-input");
  const sendBtn = document.querySelector("#send-btn");

  function styleCodeBlock(code, language) {
    // Function to apply styling to code blocks
    return `<pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>${language}</span><button class="flex gap-1 items-center copy-code-button">Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-${language}">${code}</code></div></div></pre>`;
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

  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    if (sidebar.style.width !== "0px" && e.target !== content && !content.contains(e.target) && !sidebar.contains(e.target)) {
      sidebar.style.width = "0";
      content.style.marginLeft = "0";
      document.querySelector(".open-btn").classList.add("closed");
      hideTooltip();
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