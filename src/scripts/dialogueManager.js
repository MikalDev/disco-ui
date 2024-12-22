class DialogueManager {
    constructor() {
        this.dialogueData = null;
        this.currentNode = null;
    }

    async loadDialogue() {
        try {
            const response = await fetch('./data/dialogue_long.json', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer).trim();
            this.dialogueData = JSON.parse(text);
            this.currentNode = 'start';
            return true;
        } catch (error) {
            console.error('Error loading dialogue:', error);
            return false;
        }
    }

    getCurrentDialogue() {
        if (!this.dialogueData || !this.currentNode) {
            return null;
        }
        return this.dialogueData.conversations[this.currentNode];
    }

    makeChoice(choiceId) {
        const currentDialogue = this.getCurrentDialogue();
        if (!currentDialogue) return null;

        const choice = currentDialogue.choices.find(c => c.id === choiceId);
        if (!choice) return null;

        this.currentNode = choice.nextNode;
        return this.getCurrentDialogue();
    }
}

// Create a single instance to be used across the application
const dialogueManager = new DialogueManager();
