document.addEventListener('DOMContentLoaded', () => {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', () => {
        const userText = userInput.value;
        appendToChatbotWindow(userText, 'user');
        handleUserQuery(userText);
        userInput.value = '';
    });

    function appendToChatbotWindow(text, sender) {
        const messageElement = document.createElement('p');
        messageElement.textContent = text;
        messageElement.classList.add(sender);
        chatbotWindow.appendChild(messageElement);
        chatbotWindow.scrollTop = chatbotWindow.scrollHeight;
    }

    function handleUserQuery(query) {
        let response = '';

        if (query.toLowerCase().includes('reorder')) {
            response = 'To reorder, please go to the inventory section and click the "Reorder" button next to the item.';
        } else if (query.toLowerCase().includes('low stock')) {
            response = 'Here are all low-stock items: [list of items]';
        } else {
            response = "I'm not sure how to help with that. Try asking about reordering or low stock.";
        }

        appendToChatbotWindow(response, 'bot');
    }
});

document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("user-msg");
  const chatbox = document.getElementById("chatbox");
  const message = input.value;

  chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

  fetch("/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      chatbox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
      input.value = "";
    });
});
