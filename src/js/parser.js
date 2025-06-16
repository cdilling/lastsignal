// Command parser for natural language input
class Parser {
    constructor() {
        this.verbs = {
            // Movement
            'go': 'go', 'move': 'go', 'walk': 'go', 'run': 'go', 'head': 'go',
            'n': 'go', 'north': 'go', 's': 'go', 'south': 'go', 
            'e': 'go', 'east': 'go', 'w': 'go', 'west': 'go',
            
            // Object interaction
            'take': 'take', 'get': 'take', 'pick': 'take', 'grab': 'take',
            'drop': 'drop', 'put': 'drop', 'place': 'drop',
            'use': 'use', 'activate': 'use', 'operate': 'use',
            
            // Examination
            'look': 'look', 'l': 'look', 'examine': 'examine', 
            'x': 'examine', 'inspect': 'examine', 'check': 'examine',
            
            // Inventory
            'inventory': 'inventory', 'i': 'inventory', 'inv': 'inventory',
            
            // Meta
            'help': 'help', 'h': 'help', '?': 'help',
            'save': 'save', 'load': 'load', 'quit': 'quit'
        };
        
        this.prepositions = ['with', 'on', 'in', 'at', 'to', 'from', 'using'];
        
        this.articles = ['a', 'an', 'the'];
        
        this.directions = {
            'n': 'north', 'north': 'north',
            's': 'south', 'south': 'south',
            'e': 'east', 'east': 'east',
            'w': 'west', 'west': 'west',
            'u': 'up', 'up': 'up',
            'd': 'down', 'down': 'down'
        };
    }

    parse(input) {
        if (!input) return { verb: null };
        
        // Convert to lowercase and split into tokens
        const tokens = input.toLowerCase().trim().split(/\s+/);
        
        // Remove articles
        const cleanTokens = tokens.filter(token => !this.articles.includes(token));
        
        // Handle single direction commands
        if (cleanTokens.length === 1 && this.directions[cleanTokens[0]]) {
            return {
                verb: 'go',
                object: this.directions[cleanTokens[0]]
            };
        }
        
        // Extract verb
        const verb = this.extractVerb(cleanTokens);
        if (!verb) {
            return { 
                verb: null, 
                error: "I don't understand that verb." 
            };
        }
        
        // Remove verb from tokens
        const remainingTokens = cleanTokens.slice(1);
        
        // Handle special case for directional movement
        if (verb === 'go' && remainingTokens.length > 0) {
            const direction = this.directions[remainingTokens[0]];
            if (direction) {
                return {
                    verb: verb,
                    object: direction
                };
            }
        }
        
        // Extract preposition and split tokens
        const prepIndex = remainingTokens.findIndex(token => 
            this.prepositions.includes(token)
        );
        
        let objectTokens, preposition, indirectTokens;
        
        if (prepIndex !== -1) {
            objectTokens = remainingTokens.slice(0, prepIndex);
            preposition = remainingTokens[prepIndex];
            indirectTokens = remainingTokens.slice(prepIndex + 1);
        } else {
            objectTokens = remainingTokens;
            preposition = null;
            indirectTokens = [];
        }
        
        // Join tokens to form object and indirect object
        const object = objectTokens.join(' ') || null;
        const indirect = indirectTokens.join(' ') || null;
        
        return {
            verb: verb,
            object: object,
            preposition: preposition,
            indirect: indirect,
            original: input
        };
    }

    extractVerb(tokens) {
        if (tokens.length === 0) return null;
        
        const firstToken = tokens[0];
        
        // Check if it's a known verb
        if (this.verbs[firstToken]) {
            return this.verbs[firstToken];
        }
        
        // Handle compound verbs like "pick up"
        if (tokens.length > 1) {
            const compound = tokens.slice(0, 2).join(' ');
            if (this.verbs[compound]) {
                return this.verbs[compound];
            }
        }
        
        return null;
    }

    // Fuzzy matching for item names
    matchItem(input, availableItems) {
        if (!input) return null;
        
        const normalizedInput = input.toLowerCase().trim();
        
        // Exact match
        const exactMatch = availableItems.find(item => 
            item.toLowerCase() === normalizedInput
        );
        if (exactMatch) return exactMatch;
        
        // Partial match
        const partialMatch = availableItems.find(item => 
            item.toLowerCase().includes(normalizedInput) || 
            normalizedInput.includes(item.toLowerCase())
        );
        if (partialMatch) return partialMatch;
        
        // Word-by-word match
        const inputWords = normalizedInput.split(' ');
        const wordMatch = availableItems.find(item => {
            const itemWords = item.toLowerCase().split(' ');
            return inputWords.some(inputWord => 
                itemWords.some(itemWord => itemWord === inputWord)
            );
        });
        
        return wordMatch || null;
    }

    // Get suggestions for incomplete commands
    getSuggestions(partialInput) {
        const tokens = partialInput.toLowerCase().trim().split(/\s+/);
        
        if (tokens.length === 0) return [];
        
        const suggestions = [];
        
        // Suggest verbs
        if (tokens.length === 1) {
            const verbStart = tokens[0];
            Object.keys(this.verbs).forEach(verb => {
                if (verb.startsWith(verbStart)) {
                    suggestions.push(verb);
                }
            });
        }
        
        return suggestions.slice(0, 5); // Limit suggestions
    }
}