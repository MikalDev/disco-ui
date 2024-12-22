class UIManager {
    constructor() {
        this.dialogueText = document.querySelector('.dialogue-text');
        this.dialogueChoices = document.querySelector('.dialogue-choices');
        this.portrait = document.querySelector('.portrait');
        this.speakerPortrait = document.querySelector('.speaker-portrait');
        this.speakerName = document.querySelector('.speaker-name');
        this.typewriterSpeed = 30; // milliseconds per character
    }

    async typewriterEffect(element, text) {
        element.textContent = '';
        element.classList.add('revealing');
        
        for (let char of text) {
            element.textContent += char;
            await new Promise(resolve => setTimeout(resolve, this.typewriterSpeed));
        }
        
        element.classList.remove('revealing');
    }

    createChoiceElement(choice) {
        const div = document.createElement('div');
        div.className = 'choice';
        
        // Add restart class if it's a restart option
        if (choice.text.includes('[Restart conversation]')) {
            div.classList.add('restart');
        }
        
        div.innerHTML = `<span class="number">[${choice.id}]</span> ${choice.text}`;
        
        // Add click handler
        div.addEventListener('click', () => this.handleChoice(choice.id));
        
        return div;
    }

    async displayDialogue(dialogueNode) {
        if (!dialogueNode) return;

        // Update main portrait
        this.portrait.style.backgroundImage = `url(${dialogueNode.portrait})`;

        // Update speaker portrait and name
        this.speakerPortrait.style.backgroundImage = `url(${dialogueNode.speakerPortrait})`;
        this.speakerName.textContent = dialogueNode.speaker;

        // Display text with typewriter effect
        await this.typewriterEffect(this.dialogueText, dialogueNode.text);

        // Clear and update choices
        this.dialogueChoices.innerHTML = '';
        dialogueNode.choices.forEach(choice => {
            this.dialogueChoices.appendChild(this.createChoiceElement(choice));
        });
    }

    async handleChoice(choiceId) {
        const currentDialogue = dialogueManager.getCurrentDialogue();
        const selectedChoice = currentDialogue.choices.find(c => c.id === choiceId);
        
        // If this is a restart choice, clear choices immediately
        if (selectedChoice && selectedChoice.text.includes('[Restart conversation]')) {
            this.dialogueChoices.innerHTML = '';
        } else {
            // Show detective's response first
            this.dialogueChoices.innerHTML = '';
            this.speakerPortrait.style.backgroundImage = 'url(images/detective_portrait.webp)';
            this.speakerName.textContent = 'Detective';
            await this.typewriterEffect(this.dialogueText, selectedChoice.text);
            // Add a small pause after the detective's response
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const nextDialogue = dialogueManager.makeChoice(choiceId);
        if (nextDialogue) {
            await this.displayDialogue(nextDialogue);
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keypress', (event) => {
            const key = event.key;
            if (/[1-9]/.test(key)) {
                const currentDialogue = dialogueManager.getCurrentDialogue();
                // Check if the pressed number corresponds to an available choice
                if (currentDialogue && currentDialogue.choices.some(choice => choice.id === key)) {
                    this.handleChoice(key);
                }
            }
        });
    }
}

// Create a single instance to be used across the application
const uiManager = new UIManager();
