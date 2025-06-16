export class Parser {
  constructor() {
    this.commands = {
      // Navigation
      'go': ['go', 'walk', 'move', 'head', 'travel'],
      'north': ['n', 'north'],
      'south': ['s', 'south'],
      'east': ['e', 'east'],
      'west': ['w', 'west'],
      'up': ['u', 'up', 'climb', 'ascend'],
      'down': ['d', 'down', 'descend'],
      'enter': ['enter', 'in', 'inside'],
      'exit': ['exit', 'out', 'outside', 'leave'],
      
      // Interaction
      'look': ['look', 'l', 'examine', 'x', 'inspect', 'check'],
      'take': ['take', 'get', 'grab', 'pick', 'acquire'],
      'drop': ['drop', 'put', 'place', 'leave'],
      'use': ['use', 'activate', 'operate', 'press', 'pull', 'push'],
      'open': ['open', 'unlock'],
      'close': ['close', 'shut', 'lock'],
      'read': ['read', 'scan'],
      'talk': ['talk', 'speak', 'say', 'ask', 'tell'],
      'listen': ['listen', 'hear'],
      
      // Inventory
      'inventory': ['inventory', 'i', 'inv', 'items'],
      'equip': ['equip', 'wear', 'wield'],
      'unequip': ['unequip', 'remove'],
      
      // System
      'save': ['save'],
      'load': ['load', 'restore'],
      'help': ['help', 'h', '?'],
      'quit': ['quit', 'exit', 'q'],
      'restart': ['restart', 'reset']
    };
    
    this.prepositions = ['to', 'with', 'at', 'on', 'in', 'from', 'about', 'into', 'onto'];
    this.articles = ['a', 'an', 'the'];
  }

  parse(input) {
    const normalized = input.toLowerCase().trim();
    const words = normalized.split(/\s+/);
    
    if (words.length === 0) {
      return { type: 'empty', raw: input };
    }
    
    // Check for system commands first
    const systemCommand = this.parseSystemCommand(words[0]);
    if (systemCommand) {
      return {
        type: 'game',
        action: systemCommand,
        raw: input
      };
    }
    
    // Parse story command
    const command = this.parseCommand(words);
    if (command) {
      return {
        type: 'story',
        action: command.action,
        target: command.target,
        preposition: command.preposition,
        indirect: command.indirect,
        raw: input
      };
    }
    
    // If no command found, treat as dialogue or free text
    return {
      type: 'dialogue',
      text: input,
      raw: input
    };
  }

  parseSystemCommand(word) {
    for (const [command, aliases] of Object.entries(this.commands)) {
      if (['save', 'load', 'help', 'quit', 'restart'].includes(command)) {
        if (aliases.includes(word)) {
          return command;
        }
      }
    }
    return null;
  }

  parseCommand(words) {
    let action = null;
    let actionIndex = -1;
    
    // Find the action verb
    for (let i = 0; i < words.length; i++) {
      for (const [command, aliases] of Object.entries(this.commands)) {
        if (aliases.includes(words[i])) {
          action = command;
          actionIndex = i;
          break;
        }
      }
      if (action) break;
    }
    
    if (!action) return null;
    
    // Parse the rest of the command
    const afterAction = words.slice(actionIndex + 1);
    const parsed = this.parseObjects(afterAction);
    
    return {
      action,
      target: parsed.target,
      preposition: parsed.preposition,
      indirect: parsed.indirect
    };
  }

  parseObjects(words) {
    let target = [];
    let preposition = null;
    let indirect = [];
    let currentList = target;
    
    for (const word of words) {
      if (this.prepositions.includes(word)) {
        preposition = word;
        currentList = indirect;
      } else if (!this.articles.includes(word)) {
        currentList.push(word);
      }
    }
    
    return {
      target: target.join(' ') || null,
      preposition,
      indirect: indirect.join(' ') || null
    };
  }

  // Helper methods for common parsing patterns
  isMovementCommand(action) {
    return ['go', 'north', 'south', 'east', 'west', 'up', 'down', 'enter', 'exit'].includes(action);
  }

  isInteractionCommand(action) {
    return ['look', 'take', 'drop', 'use', 'open', 'close', 'read', 'talk', 'listen'].includes(action);
  }

  isInventoryCommand(action) {
    return ['inventory', 'equip', 'unequip'].includes(action);
  }

  // Expand abbreviated commands
  expandCommand(input) {
    const abbreviations = {
      'n': 'go north',
      's': 'go south',
      'e': 'go east',
      'w': 'go west',
      'u': 'go up',
      'd': 'go down',
      'i': 'inventory',
      'l': 'look',
      'x': 'examine',
      'h': 'help'
    };
    
    return abbreviations[input.toLowerCase()] || input;
  }

  // Validate command for specific contexts
  validateCommand(command, context) {
    // Check if command makes sense in current context
    if (command.action === 'talk' && !command.target) {
      return { valid: false, error: 'Talk to whom?' };
    }
    
    if (command.action === 'use' && !command.target) {
      return { valid: false, error: 'Use what?' };
    }
    
    if (this.isMovementCommand(command.action) && context.movementBlocked) {
      return { valid: false, error: 'You cannot move in that direction.' };
    }
    
    return { valid: true };
  }

  // Generate suggestions for partial commands
  getSuggestions(partial) {
    const suggestions = [];
    const normalizedPartial = partial.toLowerCase();
    
    for (const [command, aliases] of Object.entries(this.commands)) {
      for (const alias of aliases) {
        if (alias.startsWith(normalizedPartial)) {
          suggestions.push(alias);
        }
      }
    }
    
    return [...new Set(suggestions)].sort();
  }
}