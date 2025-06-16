export class TextRenderer {
  constructor() {
    this.outputElement = null;
    this.terminal = null;
    this.currentLine = null;
    this.typewriterSpeed = 30; // ms per character
    this.linePause = 200; // ms pause between lines
    this.typewriterEnabled = true;
    this.isRendering = false;
  }

  setOutputElement(element) {
    this.outputElement = element;
    this.terminal = document.getElementById('game-terminal');
  }

  async displayText(text) {
    if (!this.outputElement) {
      console.error('Output element not set');
      return;
    }

    // Don't add empty text
    if (!text.trim()) return;
    
    // Wait if currently rendering
    while (this.isRendering) {
      await this.sleep(50);
    }
    
    // Split text into lines but keep empty lines for pacing
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        await this.renderLine(line, 'story-text');
        // Small pause between lines
        await this.sleep(100);
      }
    }
  }

  async displayUserChoice(choiceText) {
    // Wait if currently rendering
    while (this.isRendering) {
      await this.sleep(50);
    }
    
    // Add visual separator before choice
    const separator = document.createElement('div');
    separator.className = 'choice-separator';
    this.outputElement.appendChild(separator);
    
    // Display the choice with special formatting
    await this.renderLine(`▶ ${choiceText}`, 'user-choice');
    
    // Add another separator after
    const separatorAfter = document.createElement('div');
    separatorAfter.className = 'choice-separator';
    this.outputElement.appendChild(separatorAfter);
  }

  async renderLine(text, className = 'story-text') {
    this.isRendering = true;
    
    const lineElement = document.createElement('p');
    lineElement.className = className;
    this.outputElement.appendChild(lineElement);
    
    if (this.typewriterEnabled) {
      // Typewriter effect
      for (let i = 0; i < text.length; i++) {
        lineElement.textContent = text.substring(0, i + 1);
        await this.sleep(this.typewriterSpeed);
      }
    } else {
      // No animation
      lineElement.textContent = text;
    }
    
    // Auto-scroll after line completes
    this.scrollToBottom();
    
    // Small pause after line completes
    await this.sleep(this.linePause);
    
    this.isRendering = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  scrollToBottom() {
    if (!this.terminal) {
      this.terminal = document.getElementById('game-terminal');
    }
    
    requestAnimationFrame(() => {
      if (this.terminal) {
        // Simply scroll to the bottom of the content
        this.terminal.scrollTop = this.terminal.scrollHeight;
      }
    });
  }

  clear() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
    this.textQueue = [];
    this.isRendering = false;
  }

  setTypewriterSpeed(speed) {
    this.typewriterSpeed = speed;
  }

  setTypewriterEnabled(enabled) {
    this.typewriterEnabled = enabled;
  }
}