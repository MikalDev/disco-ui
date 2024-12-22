async function initializeApp() {
    // Load the dialogue data
    const success = await dialogueManager.loadDialogue();
    if (!success) {
        console.error('Failed to load dialogue data');
        return;
    }

    // Setup keyboard controls
    uiManager.setupKeyboardControls();

    // Display the initial dialogue
    const initialDialogue = dialogueManager.getCurrentDialogue();
    await uiManager.displayDialogue(initialDialogue);
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
