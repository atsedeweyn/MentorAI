class ChatApp {
    constructor() {
        this.currentSessionId = null;
        this.isProcessing = false;
        this.messageHistory = [];
        this.typingSpeed = 10; // Milliseconds between each character
        
        // Initialize UI elements
        this.initializeUI();
        // Bind event listeners
        this.bindEvents();
    }

    initializeUI() {
        this.elements = {
            channelInput: document.getElementById('channel-input'),
            messageInput: document.getElementById('message-input'),
            sendButton: document.getElementById('send-button'),
            chatContainer: document.getElementById('chat-container'),
            processButton: document.getElementById('process-channel-btn'),
            output: document.getElementById('output')
        };

        // Disable chat interface initially
        this.elements.messageInput.disabled = true;
        this.elements.sendButton.disabled = true;
    }

    bindEvents() {
        // Handle Enter key in message input
        this.elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Handle channel processing
        this.elements.processButton.addEventListener('click', () => this.processChannel());
        
        // Handle send button click
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
    }

    
    loadAndTypeText() {
        const text = "The History of Planet Earth: From Cosmic Dust to Modern DayThe Formation Era (4.6 - 4.5 Billion Years Ago)Our planet's story begins in the swirling chaos of the early solar system. About 4.6 billion years ago, gravity pulled together a massive cloud of gas and dust, forming a proto-planetary disk around our young Sun. Through a process called accretion, increasingly larger particles collided and merged, eventually forming Earth and its sister planets.The early Earth was a hellish place - a molten sphere bombarded constantly by asteroids and comets. One particularly massive collision with a Mars-sized object, dubbed Theia, ejected enough material to form our Moon. This impact may have also given Earth its characteristic tilt, creating our seasons.The Hadean Eon (4.5 - 4 Billion Years Ago)Named after Hades, the Greek god of the underworld, this period saw Earth's surface gradually cool and solidify. The first atmosphere formed primarily from volcanic outgassing, consisting mainly of water vapor, carbon dioxide, and nitrogen. As the planet cooled, water vapor condensed into oceans, and the first crustal rocks formed.The Archean Eon (4 - 2.5 Billion Years Ago)Life emerged during this period, though exactly when and how remains debated. The first organisms were simple prokaryotes, possibly emerging around hydrothermal vents in the ancient oceans. A crucial development was the evolution of photosynthetic cyanobacteria, which began releasing oxygen as a waste product - setting the stage for the Great Oxidation Event.The Proterozoic Eon (2.5 Billion - 541 Million Years Ago)The Great Oxidation Event transformed Earth's atmosphere, creating conditions necessary for complex life. Oxygen levels rose dramatically, forming the ozone layer and rusting much of Earth's iron - creating the banded iron formations we see today. The first multicellular organisms evolved, including the earliest algae and fungi.This era also saw several ";
        typeText(text);
    }

    typeText(text) {
        if (i < text.length) {
            output.value += text.charAt(i); // Add one character at a time
            i++;
            setTimeout(typeCharacter, 50); // Adjust typing speed (50ms)
            setTimeout(typeCharacter, 10); // Adjust typing speed (50ms)
        }
    }

    addMessage(sender, text, className = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender.toLowerCase()}-message ${className}`;
        messageDiv.textContent = text;
        this.elements.chatContainer.appendChild(messageDiv);
        this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;

        // If it's a bot message, type it out in the output area
        if (sender === "Bot") {
            this.loadAndTypeText(text);
        }
    }

    async processChannel() {
        if (this.isProcessing) return;
        
        const channelName = this.elements.channelInput.value.trim();
        if (!channelName) {
            this.addMessage("System", "Please enter a channel name.", "error-message");
            return;
        }

        this.isProcessing = true;
        this.elements.processButton.disabled = true;
        this.addMessage("System", "Processing channel...", "loading");

        try {
            const response = await fetch('http://localhost:8000/api/channel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channel_name: channelName })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentSessionId = data.session_id;

            // Enable chat interface
            this.elements.messageInput.disabled = false;
            this.elements.sendButton.disabled = false;

            this.addMessage("System", "Channel processed successfully! You can now start chatting about the channel's content.", "success-message");
        } catch (error) {
            console.error('Error:', error);
            this.addMessage("System", `Error processing channel: ${error.message}`, "error-message");
        } finally {
            this.isProcessing = false;
            this.elements.processButton.disabled = false;
            // Remove loading message
            const loadingMessage = this.elements.chatContainer.querySelector('.loading');
            if (loadingMessage) {
                loadingMessage.remove();
            }
        }
    }

    async sendMessage() {
        if (!this.currentSessionId || this.isProcessing) return;

        const message = this.elements.messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage("User", message, "user-message");
        this.elements.messageInput.value = '';
        this.isProcessing = true;
        this.elements.sendButton.disabled = true;

        try {
            const response = await fetch(`http://localhost:8000/api/chat/${this.currentSessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.addMessage("Bot", data.response, "bot-message");
        } catch (error) {
            console.error('Error:', error);
            this.addMessage("System", "Error sending message. Please try again.", "error-message");
        } finally {
            this.isProcessing = false;
            this.elements.sendButton.disabled = false;
        }
    }
}

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
});

// index.html js. 
document.getElementById('start_button').addEventListener('click', (event) => {
    event.preventDefault(); 
    const url = document.getElementById('yt_link').value.trim(); 
    if (url === "") {
        return false; 
    }
    window.location.href = "home.html"; 
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('yt_link'); 
    const button = document.getElementById('start_button');
    input.addEventListener('input', () => {
        if (input.value.trim() !== "") {
            button.disabled = false; 
        }
        else {
            button.disabled = true; 
        }
    })

    const help = document.getElementById('input_help');
    button.addEventListener('mouseover', () => {
        if (button.disabled) {
            help.style.display = 'block'; 
        }
    })

    button.addEventListener('mouseout', () => {
        help.style.display = 'none'; 
    })
})
