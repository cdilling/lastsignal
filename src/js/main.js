// Main entry point for The Last Signal
import AINarrator from './ai-narrator.js';

class Game {
    constructor() {
        this.parser = new Parser();
        this.saveSystem = new SaveSystem();
        this.aiNarrator = new AINarrator();
        this.inkStory = null;
        this.currentChoices = [];
        this.currentAI = null;
        this.inAIConversation = false;
        this.initializeGame();
    }

    async initializeGame() {
        // Check for API key and initialize AI
        await this.initializeAI();
        // Set up terminal input handling
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    this.processCommand(command);
                    terminalInput.value = '';
                }
            }
        });

        // Load the Ink story
        try {
            const response = await fetch('src/story/main.ink.json');
            if (!response.ok) {
                // If compiled version doesn't exist, show intro and basic game
                this.displayOutput("Starting basic game mode...");
                this.engine = new GameEngine();
                this.engine.startNewGame();
                this.displayIntro();
                return;
            }
            const storyContent = await response.text();
            this.inkStory = new inkjs.Story(storyContent);
            
            // Load saved game or start new
            const savedGame = this.saveSystem.load();
            if (savedGame && savedGame.inkState) {
                this.inkStory.state.LoadJson(savedGame.inkState);
                this.displayOutput("Game loaded. Welcome back to The Last Signal.");
            } else {
                this.displayIntro();
            }
            
            // Continue the story
            this.continueStory();
            
        } catch (error) {
            console.error("Error loading Ink story:", error);
            // Fallback to basic game engine
            this.engine = new GameEngine();
            this.engine.startNewGame();
            this.displayIntro();
        }

        // Auto-save every 60 seconds
        setInterval(() => {
            this.saveGame();
        }, 60000);
    }
    
    async initializeAI() {
        // Check for API key in environment or localStorage
        let apiKey = import.meta.env?.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
        
        if (!apiKey && !this.aiNarrator.fallbackMode) {
            // Show API key prompt
            this.displayOutput("=== AI System Initialization ===");
            this.displayOutput("To enable dynamic AI conversations, please enter your OpenAI API key.");
            this.displayOutput("(Press Enter to skip and use scripted responses)");
            this.displayOutput("");
            
            // Wait for API key input
            await new Promise((resolve) => {
                const handleKeyInput = (e) => {
                    if (e.key === 'Enter') {
                        const input = e.target.value.trim();
                        if (input) {
                            apiKey = input;
                            localStorage.setItem('openai_api_key', apiKey);
                            this.displayOutput("API key saved. Initializing AI system...");
                        } else {
                            this.displayOutput("Continuing with scripted AI responses...");
                        }
                        e.target.value = '';
                        e.target.removeEventListener('keypress', handleKeyInput);
                        resolve();
                    }
                };
                document.getElementById('terminal-input').addEventListener('keypress', handleKeyInput);
            });
        }
        
        await this.aiNarrator.initialize(apiKey);
    }

    async processCommand(command) {
        this.displayOutput(`> ${command}`, 'command');
        
        // Check if we're in an AI conversation
        if (this.inAIConversation && this.currentAI) {
            // Special commands to exit AI conversation
            if (command.toLowerCase() === 'leave' || command.toLowerCase() === 'exit') {
                this.inAIConversation = false;
                this.displayOutput(`You disconnect from ${this.currentAI}.`);
                this.currentAI = null;
                this.continueStory();
                return;
            }
            
            // Generate AI response
            this.displayOutput(`${this.currentAI} is processing...`, 'system');
            const response = await this.aiNarrator.generateResponse(command, this.currentAI);
            this.displayOutput(`${this.currentAI}: ${response}`, `ai-${this.currentAI.toLowerCase()}`);
            this.displayOutput("\n[Type 'leave' to end conversation]", 'hint');
            return;
        }
        
        // Check if we're in Ink story mode
        if (this.inkStory && this.currentChoices.length > 0) {
            // Try to match command to a choice
            const choiceNum = parseInt(command);
            if (!isNaN(choiceNum) && choiceNum > 0 && choiceNum <= this.currentChoices.length) {
                this.inkStory.ChooseChoiceIndex(choiceNum - 1);
                this.continueStory();
                this.saveGame();
                return;
            }
            
            // Try to match by text
            const lowerCommand = command.toLowerCase();
            const matchedChoice = this.currentChoices.findIndex(choice => 
                choice.text.toLowerCase().includes(lowerCommand) ||
                lowerCommand.includes(choice.text.toLowerCase())
            );
            
            if (matchedChoice !== -1) {
                this.inkStory.ChooseChoiceIndex(matchedChoice);
                this.continueStory();
                this.saveGame();
                return;
            }
        }
        
        // Handle system commands
        if (command.toLowerCase() === 'help') {
            this.showHelp();
            return;
        }
        
        if (command.toLowerCase() === 'save') {
            this.saveGame();
            this.displayOutput("Game saved.");
            return;
        }
        
        if (command.toLowerCase() === 'restart') {
            if (confirm("Are you sure you want to restart? All progress will be lost.")) {
                this.restartGame();
            }
            return;
        }
        
        // If we have the basic engine, use it
        if (this.engine) {
            const parsedCommand = this.parser.parse(command);
            const response = this.engine.executeCommand(parsedCommand);
            this.displayOutput(response);
            this.saveGame();
        } else if (this.currentChoices.length > 0) {
            this.displayOutput("Please choose one of the available options.");
        } else {
            this.displayOutput("I don't understand that command. Type 'help' for available commands.");
        }
    }
    
    async continueStory() {
        if (!this.inkStory) return;
        
        // Get story text
        while (this.inkStory.canContinue) {
            const text = this.inkStory.Continue();
            
            // Check for AI conversation markers
            if (text.includes("[AI_CONVERSATION:")) {
                const aiMatch = text.match(/\[AI_CONVERSATION:(\w+)\]/);
                if (aiMatch) {
                    this.currentAI = aiMatch[1];
                    this.inAIConversation = true;
                    const cleanText = text.replace(/\[AI_CONVERSATION:\w+\]/, '');
                    if (cleanText.trim()) {
                        this.displayOutput(cleanText.trim());
                    }
                    this.displayOutput(`\n[You are now connected to ${this.currentAI}. Type anything to converse, or 'leave' to disconnect]`, 'system');
                    return; // Stop processing choices while in AI conversation
                }
            }
            
            if (text.trim()) {
                this.displayOutput(text.trim());
            }
        }
        
        // Display choices
        this.currentChoices = this.inkStory.currentChoices;
        if (this.currentChoices.length > 0) {
            this.displayOutput("\n");
            this.currentChoices.forEach((choice, index) => {
                this.displayOutput(`${index + 1}. ${choice.text}`, 'choice');
            });
        } else if (!this.inkStory.canContinue) {
            // Story is complete
            this.displayOutput("\n[THE END]", 'system');
            this.displayOutput("Type 'restart' to play again.");
        }
    }
    
    saveGame() {
        const saveData = {
            timestamp: Date.now()
        };
        
        if (this.inkStory) {
            saveData.inkState = this.inkStory.state.toJson();
        }
        
        if (this.engine) {
            saveData.engineState = this.engine.getState();
        }
        
        this.saveSystem.save(saveData);
    }
    
    restartGame() {
        this.saveSystem.clear();
        location.reload();
    }
    
    showHelp() {
        let helpText = `Available commands:
- Type the number or keywords of a choice to select it
- save: Save your progress
- restart: Start a new game
- help: Show this help message`;
        
        if (this.engine) {
            helpText += `\n\nGame commands:
- look: Examine your surroundings
- go [direction]: Move in a direction
- take [item]: Pick up an item
- examine [item]: Look closely at something
- inventory: Check what you're carrying`;
        }
        
        this.displayOutput(helpText);
    }

    displayOutput(text, className = '') {
        const terminalOutput = document.getElementById('terminal-output');
        const outputLine = document.createElement('div');
        outputLine.textContent = text;
        if (className) {
            outputLine.classList.add(className);
        }
        terminalOutput.appendChild(outputLine);
        
        // Smooth auto-scroll to bottom
        terminalOutput.scrollTo({
            top: terminalOutput.scrollHeight,
            behavior: 'smooth'
        });
    }

    displayIntro() {
        const intro = `
THE LAST SIGNAL
===============

You wake to the hum of recycled air and the faint glow of emergency lighting. 
The space station Aurora-7 drifts silently through the void, its crew of 200 
souls mysteriously absent.

You are Communications Officer Sarah Chen, and you've just received what might 
be humanity's last signal...

Type 'help' for available commands.
        `.trim();
        
        this.displayOutput(intro);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});