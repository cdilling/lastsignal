import { Story } from 'inkjs';
import { GameEngine } from './game-engine.js';
import { Parser } from './parser.js';
import { SaveSystem } from './save-system.js';
import { compiledStory } from './src/story/full-game-story.js';
import AINarrator from './src/js/ai-narrator.js';
import { TextRenderer } from './text-renderer.js';

class LastSignalGame {
  constructor() {
    this.engine = null;
    this.parser = new Parser();
    this.saveSystem = new SaveSystem();
    this.story = null;
    this.aiNarrator = null;
    this.textRenderer = new TextRenderer();
    this.apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || null;
    this.aiEnabled = false;
    this.choiceButtons = [];
    
    this.setupUI();
    this.setupKeyboardNavigation();
  }

  setupUI() {
    const gameContainer = document.getElementById('game-container');
    const apiKeySection = document.getElementById('api-key-section');
    
    // Set up text renderer output element
    this.textRenderer.setOutputElement(document.getElementById('game-output'));
    
    // Set up scroll detection
    this.setupScrollDetection();
    
    // Check if we have an API key from env
    if (this.apiKey) {
      // We have a key, skip the API screen
      apiKeySection.style.display = 'none';
      gameContainer.style.display = 'block';
      // Initialize game immediately
      this.initializeGame();
    } else {
      // No key, show the API key form
      apiKeySection.style.display = 'block';
      gameContainer.style.display = 'none';
    }

    // API Key form handler (for when no env key exists)
    const apiKeyForm = document.getElementById('api-key-form');
    if (apiKeyForm) {
      apiKeyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const keyInput = document.getElementById('api-key-input');
        this.apiKey = keyInput.value.trim();
        
        if (this.apiKey) {
          localStorage.setItem('openai_api_key', this.apiKey);
          apiKeySection.style.display = 'none';
          gameContainer.style.display = 'block';
          await this.initializeGame();
        }
      });
    }

    // Game input
    const inputForm = document.getElementById('input-form');
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('player-input');
      if (input.value.trim()) {
        this.handlePlayerInput(input.value.trim());
        input.value = '';
      }
    });

    // Save/Load buttons
    document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
    document.getElementById('load-btn').addEventListener('click', () => this.loadGame());
    document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
  }

  async initializeGame() {
    try {
      // Initialize game engine with API key from env
      this.engine = new GameEngine(this.apiKey);
      
      // Initialize AI narrator
      this.aiNarrator = new AINarrator();
      await this.aiNarrator.initialize(this.apiKey);
      
      // Enable AI features since we have the key in .env
      this.aiEnabled = true;
      
      // Create Ink story from compiled JSON
      this.story = new Story(compiledStory);
      
      // Bind external functions for AI integration
      this.story.BindExternalFunction("generate_ai_response", async (context, prompt) => {
        return await this.engine.generateAIResponse(context, prompt);
      });
      
      this.story.BindExternalFunction("analyze_player_choice", async (choice, context) => {
        return await this.engine.analyzePlayerChoice(choice, context);
      });
      
      // Start the game
      this.startGame();
    } catch (error) {
      console.error('Failed to initialize game:', error);
      // If there's an error, try to continue with the story anyway
      await this.displayText('Welcome to The Last Signal...');
      await this.displayText('Type "begin" or "wake up" to start your journey.');
    }
  }

  async startGame() {
    await this.displayText('=== THE LAST SIGNAL ===');
    await this.displayText('A sci-fi text adventure');
    await this.displayText('');
    await this.displayText('Type "begin" to start your journey...');
  }

  async continueStory() {
    // Remove any existing choices from the output
    const existingChoices = document.querySelectorAll('.choices');
    existingChoices.forEach(el => el.remove());
    
    while (this.story.canContinue) {
      let text = this.story.Continue();
      
      // Check for AI response markers
      if (text.includes('[AI_RESPONSE]')) {
        // Get the current AI and player input from story variables
        const currentAI = this.story.variablesState["current_ai"];
        const playerInput = this.story.variablesState["last_player_input"];
        
        if (currentAI && playerInput) {
          // Generate AI response
          const aiResponse = await this.aiNarrator.generateResponse(playerInput, currentAI);
          text = text.replace('[AI_RESPONSE]', aiResponse);
        }
      }
      
      // Check for AI generation tags
      if (text.includes('[AI_GENERATE]')) {
        const aiText = await this.handleAIGeneration(text);
        await this.displayText(aiText);
      } else {
        await this.displayText(text);
      }
    }
    
    // Display choices if available
    if (this.story.currentChoices.length > 0) {
      await this.displayChoices(this.story.currentChoices);
    }
  }

  async handleAIGeneration(text) {
    const match = text.match(/\[AI_GENERATE:(.*?)\]/);
    if (match) {
      const prompt = match[1];
      const context = this.getGameContext();
      const aiResponse = await this.engine.generateAIResponse(context, prompt);
      return text.replace(/\[AI_GENERATE:.*?\]/, aiResponse);
    }
    return text;
  }

  async displayText(text) {
    return this.textRenderer.displayText(text);
  }

  formatText(text) {
    // Convert markdown-style formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  displayChoices(choices) {
    const outputElement = document.getElementById('game-output');
    
    // Clear previous choice buttons array
    this.choiceButtons = [];
    
    // Check if we have choices to display
    if (choices.length === 0) {
      this.displayText('[ THE END ]');
      return;
    }
    
    // Create choices container inline with story
    const choicesContainer = document.createElement('div');
    choicesContainer.className = 'choices';
    
    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      button.textContent = `${index + 1}. ${choice.text}`;
      button.addEventListener('click', async () => {
        // Disable all buttons immediately
        this.disableAllChoices();
        
        // Display the user's choice in the terminal
        await this.textRenderer.displayUserChoice(choice.text);
        
        // Small pause for effect
        await this.sleep(300);
        
        // Process the choice
        this.selectChoice(choice.index);
      });
      
      this.choiceButtons.push(button);
      choicesContainer.appendChild(button);
    });
    
    // Append choices to the game output
    outputElement.appendChild(choicesContainer);
    
    // Scroll to show the choices
    this.textRenderer.scrollToBottom();
  }

  async selectChoice(choiceIndex) {
    // Remove the choices container from the output
    const choicesContainers = document.querySelectorAll('.choices');
    choicesContainers.forEach(el => el.remove());
    
    // Process choice through AI if configured
    const choice = this.story.currentChoices[choiceIndex];
    const context = this.getGameContext();
    const analysis = await this.engine.analyzePlayerChoice(choice.text, context);
    
    // Continue story with choice
    this.story.ChooseChoiceIndex(choiceIndex);
    
    // Continue story
    this.continueStory();
  }

  disableAllChoices() {
    this.choiceButtons.forEach(button => {
      button.disabled = true;
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < this.choiceButtons.length && !this.choiceButtons[index].disabled) {
          this.choiceButtons[index].click();
        }
      }
    });
  }
  
  setupScrollDetection() {
    const terminal = document.getElementById('game-terminal');
    if (terminal) {
      terminal.addEventListener('scroll', () => {
        if (terminal.scrollTop > 50) {
          terminal.classList.add('scrolled');
        } else {
          terminal.classList.remove('scrolled');
        }
      });
    }
  }

  async handlePlayerInput(input) {
    // Check for start commands first
    const startCommands = ['begin', 'start', 'wake up', 'wake', 'new game', 'play'];
    if (startCommands.includes(input.toLowerCase().trim())) {
      await this.textRenderer.displayUserChoice(input);
      this.beginStory();
      return;
    }
    
    // Parse player input
    const command = this.parser.parse(input);
    
    if (command.type === 'game') {
      // Handle game commands (save, load, etc.)
      this.handleGameCommand(command);
    } else {
      // Process as story input
      await this.textRenderer.displayUserChoice(input);
      
      // Check if we're in an AI conversation
      const currentAI = this.story.variablesState["current_ai"];
      if (currentAI) {
        // Set the player input in story variables
        this.story.variablesState["last_player_input"] = input;
        
        // Generate AI response
        const response = await this.aiNarrator.generateResponse(input, currentAI);
        this.displayText(response);
        
        // Show options to continue
        await this.displayText("");
        const outputElement = document.getElementById('game-output');
        
        // Create inline choices for AI conversation
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices';
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'choice-btn';
        continueBtn.textContent = 'Continue talking';
        continueBtn.onclick = () => this.continueAIConversation();
        
        const endBtn = document.createElement('button');
        endBtn.className = 'choice-btn';
        endBtn.textContent = 'End conversation';
        endBtn.onclick = () => this.endAIConversation();
        
        choicesContainer.appendChild(continueBtn);
        choicesContainer.appendChild(endBtn);
        outputElement.appendChild(choicesContainer);
        
        // Scroll to show choices
        this.textRenderer.scrollToBottom();
      } else if (this.story.currentChoices.length === 0) {
        // Generate AI response based on free-form input
        const context = this.getGameContext();
        const response = await this.engine.generateAIResponse(context, input);
        this.displayText(response);
      }
    }
  }
  
  async continueAIConversation() {
    // Remove existing choices
    const choicesContainers = document.querySelectorAll('.choices');
    choicesContainers.forEach(el => el.remove());
    
    await this.displayText("What would you like to say?");
  }
  
  async endAIConversation() {
    // Remove existing choices
    const choicesContainers = document.querySelectorAll('.choices');
    choicesContainers.forEach(el => el.remove());
    
    this.story.variablesState["current_ai"] = "";
    await this.continueStory();
  }
  
  beginStory() {
    // Clear the intro text
    this.textRenderer.clear();
    
    // Just continue the story from the beginning
    if (this.story) {
      this.continueStory();
    }
  }

  handleGameCommand(command) {
    switch (command.action) {
      case 'save':
        this.saveGame();
        break;
      case 'load':
        this.loadGame();
        break;
      case 'help':
        this.displayHelp();
        break;
      default:
        this.displayText('Unknown command. Type "help" for available commands.');
    }
  }

  getGameContext() {
    return {
      currentText: this.story.currentText || '',
      variables: this.story.variablesState,
      history: this.getRecentHistory(),
      location: this.story.variablesState['current_location'] || 'Unknown'
    };
  }

  getRecentHistory() {
    const output = document.getElementById('game-output');
    const texts = Array.from(output.querySelectorAll('.story-text'));
    return texts.slice(-10).map(el => el.textContent).join('\n');
  }

  saveGame() {
    const saveData = {
      story: this.story.state.toJson(),
      timestamp: new Date().toISOString()
    };
    
    this.saveSystem.save('autosave', saveData);
    this.displayText('Game saved.');
  }

  loadGame() {
    const saveData = this.saveSystem.load('autosave');
    
    if (saveData) {
      this.story.state.LoadJson(saveData.story);
      document.getElementById('game-output').innerHTML = '';
      this.displayText('Game loaded.');
      this.continueStory();
    } else {
      this.displayText('No save game found.');
    }
  }

  displayHelp() {
    const helpText = `
Available commands:
- begin/start/wake up: Start a new game
- save: Save your current progress
- load: Load your saved game
- help: Display this help message

Navigation: north/south/east/west (or n/s/e/w)
Actions: look, take, use, talk, examine

You can also type freely to interact with the story when prompted.
    `;
    this.displayText(helpText);
  }

  displayError(message) {
    const output = document.getElementById('game-output');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    output.appendChild(errorDiv);
  }

  showAIWarning(message) {
    const existingWarning = document.getElementById('ai-warning');
    if (existingWarning) {
      existingWarning.remove();
    }
    
    const warning = document.createElement('div');
    warning.id = 'ai-warning';
    warning.className = 'ai-warning';
    warning.innerHTML = `
      <span>${message}</span>
      <button onclick="game.openSettings()">Open Settings</button>
    `;
    
    const gameContainer = document.getElementById('game-container');
    gameContainer.insertBefore(warning, gameContainer.firstChild);
  }

  openSettings() {
    const modal = document.getElementById('settings-modal') || this.createSettingsModal();
    modal.style.display = 'block';
    
    // Populate current API key
    const keyInput = document.getElementById('settings-api-key');
    keyInput.value = this.apiKey || '';
  }

  createSettingsModal() {
    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="game.closeSettings()">&times;</span>
        <h2>Settings</h2>
        <div class="settings-group">
          <label for="settings-api-key">OpenAI API Key:</label>
          <input type="password" id="settings-api-key" placeholder="sk-...">
          <button onclick="game.testApiKey()">Test Key</button>
          <div id="api-key-status"></div>
        </div>
        <button onclick="game.saveSettings()">Save Settings</button>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'none';
  }

  async testApiKey() {
    const keyInput = document.getElementById('settings-api-key');
    const status = document.getElementById('api-key-status');
    const testKey = keyInput.value.trim();
    
    if (!testKey) {
      status.innerHTML = '<span style="color: #ff6b6b;">Please enter an API key</span>';
      return;
    }
    
    status.innerHTML = '<span style="color: #51cf66;">Testing...</span>';
    
    // Test the key
    const testEngine = new GameEngine(testKey);
    const isValid = await testEngine.validateApiKey();
    
    if (isValid) {
      status.innerHTML = '<span style="color: #51cf66;">✓ Valid API key</span>';
    } else {
      status.innerHTML = '<span style="color: #ff6b6b;">✗ Invalid API key</span>';
    }
  }

  async saveSettings() {
    const keyInput = document.getElementById('settings-api-key');
    const newKey = keyInput.value.trim();
    
    if (newKey && newKey !== this.apiKey) {
      this.apiKey = newKey;
      localStorage.setItem('openai_api_key', newKey);
      
      // Re-initialize engine with new key
      this.engine = new GameEngine(this.apiKey);
      this.aiEnabled = await this.engine.validateApiKey();
      
      if (this.aiEnabled) {
        // Remove warning
        const warning = document.getElementById('ai-warning');
        if (warning) warning.remove();
        this.displayText('\n[AI features enabled successfully!]\n');
      }
    }
    
    this.closeSettings();
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new LastSignalGame();
});