document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.querySelector(".chat-box");
  const messageInput = document.querySelector("#message-input");
  const sendBtn = document.querySelector("#send-btn");
  let currentRow = 1; // Şu anki satır sayısı

  function addMessage(message, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", isUser ? "user-message" : "bot-message");
    msgDiv.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // En alta kaydır
  }

  sendBtn.addEventListener("click", function() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true); // Kullanıcı mesajını ekle
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
      .then(response => response.json())
      .then(data => {
        addMessage(data.answer, false); // Bot yanıtını ekle
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      messageInput.value = ""; // Girdiyi temizle
      messageInput.style.height = '24px'; // Giriş yüksekliğini varsayılana geri döndür
      currentRow = 1; // Şu anki satırı sıfırla
    }
  });

  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendBtn.click();
      e.preventDefault();
    }
  });

  // Yeni eklenen kısım:
  messageInput.addEventListener('input', function() {
    if (!this.value) {
      this.style.height = '24px'; // İçerik silindiğinde varsayılan yükseklik
    } else {
      const rowCount = (this.value.match(/\n/g) || []).length + 1; // Satır sayısını hesapla
      const newHeight = 24 + (rowCount - 1) * 24; // Yeni yüksekliği hesapla (her satır için 24px artış)
      this.style.height = newHeight + 'px'; // İçerik varsa genişlet
      currentRow = rowCount; // Şu anki satır sayısını güncelle
    }
  });
});
