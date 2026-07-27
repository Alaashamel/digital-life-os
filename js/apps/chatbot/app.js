const ChatbotApp = {
    messages: [],
    window: null,
    responses: {
        'hello': 'Hello! How can I help you today?',
        'hi': 'Hi there! What can I do for you?',
        'how are you': 'I\'m functioning perfectly! How about you?',
        'what is your name': 'I\'m the Digital Life OS Assistant!',
        'help': 'I can help with general questions and chat!',
        'time': `The current time is ${new Date().toLocaleTimeString()}`,
        'date': `Today\'s date is ${new Date().toLocaleDateString()}`,
        'joke': 'Why did the programmer quit? He didn\'t get arrays! 😄',
    },
    
    init(window) {
        this.window = window;
        this.loadHistory();
        this.render();
        Notifications.success('Chatbot', 'Chatbot launched');
    },
    
    loadHistory() {
        this.messages = Storage.get('dlos_chatbot_history', [{ type: 'bot', text: 'Hello! I\'m your Digital Life OS Assistant.' }]);
    },
    
    saveHistory() {
        Storage.set('dlos_chatbot_history', this.messages);
    },
    
    getResponse(input) {
        const lower = input.toLowerCase().trim();
        for (const [key, response] of Object.entries(this.responses)) {
            if (lower.includes(key)) return response;
        }
        return 'That\'s interesting! Could you tell me more?';
    },
    
    sendMessage(text) {
        if (!text.trim()) return;
        this.messages.push({ type: 'user', text });
        this.saveHistory();
        this.render();
        setTimeout(() => {
            this.messages.push({ type: 'bot', text: this.getResponse(text) });
            this.saveHistory();
            this.render();
        }, 300);
    },
    
    render() {
        const content = this.window.getContent();
        content.innerHTML = `<div class="chatbot-app"><div class="chat-messages" id="chat-messages">${this.messages.map(msg => `<div class="chat-message chat-${msg.type}"><div class="chat-bubble">${msg.text}</div></div>`).join('')}</div><div class="chat-input-area"><input type="text" id="chat-input" class="input" placeholder="Type message..." style="flex:1"><button class="btn btn-icon" onclick="const input = document.getElementById('\''chat-input\''); ChatbotApp.sendMessage(input.value); input.value = '\''\'';">📨</button></div><style>.chatbot-app{display:flex;flex-direction:column;height:100%}.chat-messages{flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:10px}.chat-message{display:flex;animation:slideIn var(--transition-normal)}.chat-user{justify-content:flex-end}.chat-user .chat-bubble{background:var(--accent-color);color:var(--bg-primary)}.chat-bot{justify-content:flex-start}.chat-bot .chat-bubble{background:var(--bg-tertiary);border:1px solid var(--border-color)}.chat-bubble{max-width:70%;padding:12px;border-radius:12px;word-wrap:break-word;line-height:1.4;font-size:14px}.chat-input-area{display:flex;gap:8px;padding:10px;border-top:1px solid var(--border-color)}@keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}</style></div>`;
        const msgs = document.getElementById('chat-messages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
        document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                ChatbotApp.sendMessage(e.target.value);
                e.target.value = '';
            }
        });
    }
};