// Replace with your Hugging Face API token
const API_TOKEN = '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';
const API_URL = 'https://api-inference.huggingface.co/models/gpt2';

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    userInput.value = '';

    try {
        // Get AI response
        const response = await queryAI(message);
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

async function queryAI(input) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: input,
            parameters: {
                max_length: 100,
                temperature: 0.7
            }
        })
    });

    const data = await response.json();
    return data[0]?.generated_text || "I don't understand...";
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Allow Enter key to send message
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
