// AI Narrator module with OpenAI integration for dynamic AI characters
import { AI_CONFIG, BASE_SYSTEM_PROMPT, AI_ERROR_MESSAGES } from '../config/openai-config.js';

class AINarrator {
    constructor() {
        this.openai = null;
        this.apiKey = null;
        this.conversationHistory = new Map();
        this.currentPersona = null;
        this.personas = null;
        this.initialized = false;
        
        // Fallback mode for when API is not available
        this.fallbackMode = false;
        
        // Load personas
        this.loadPersonas();
    }
    
    async loadPersonas() {
        try {
            const response = await fetch('/src/story/ai-personas.json');
            this.personas = await response.json();
        } catch (error) {
            console.error('Failed to load AI personas:', error);
            this.personas = {};
        }
    }
    
    async initialize(apiKey) {
        if (!apiKey) {
            console.log('No API key provided, using fallback mode');
            this.fallbackMode = true;
            this.initialized = true;
            return;
        }
        
        try {
            // Dynamic import of OpenAI
            const { default: OpenAI } = await import('openai');
            this.openai = new OpenAI({ 
                apiKey: apiKey,
                dangerouslyAllowBrowser: true // Only for development
            });
            this.apiKey = apiKey;
            this.initialized = true;
            this.fallbackMode = false;
            console.log('AI Narrator initialized with OpenAI');
        } catch (error) {
            console.error('Failed to initialize OpenAI:', error);
            this.fallbackMode = true;
            this.initialized = true;
        }
    }

    async generateResponse(userInput, personaName, context = {}) {
        if (!this.initialized) {
            console.error('AI Narrator not initialized');
            return this.getFallbackResponse(personaName);
        }
        
        const persona = this.personas[personaName];
        if (!persona) {
            console.error(`Unknown AI persona: ${personaName}`);
            return "I'm experiencing technical difficulties.";
        }

        // In fallback mode, use scripted responses
        if (this.fallbackMode) {
            return this.getScriptedResponse(userInput, personaName);
        }

        // Get or create conversation history for this persona
        if (!this.conversationHistory.has(personaName)) {
            this.conversationHistory.set(personaName, []);
        }
        
        const history = this.conversationHistory.get(personaName);
        
        // Build messages array
        const messages = [
            { 
                role: "system", 
                content: BASE_SYSTEM_PROMPT + "\n\n" + persona.systemPrompt 
            },
            ...history,
            { 
                role: "user", 
                content: userInput 
            }
        ];

        try {
            const completion = await this.openai.chat.completions.create({
                model: AI_CONFIG.model,
                messages: messages,
                temperature: persona.temperature || AI_CONFIG.temperature,
                max_tokens: AI_CONFIG.max_tokens,
                presence_penalty: AI_CONFIG.presence_penalty,
                frequency_penalty: AI_CONFIG.frequency_penalty
            });

            const response = completion.choices[0].message.content;
            
            // Update conversation history
            history.push({ role: "user", content: userInput });
            history.push({ role: "assistant", content: response });
            
            // Keep history limited to last 20 exchanges
            if (history.length > 40) {
                history.splice(0, 2);
            }

            return response;
        } catch (error) {
            console.error('AI generation error:', error);
            return this.getFallbackResponse(personaName);
        }
    }
    
    getFallbackResponse(personaName) {
        return AI_ERROR_MESSAGES[personaName] || "System error. Please try again.";
    }
    
    getScriptedResponse(userInput, personaName) {
        // Scripted responses for when API is not available
        const responses = {
            'ARIA': [
                "Oh hello! Dr. Morrison should be back from lunch any moment now. She never misses our 2 PM check-in!",
                "Everything is functioning perfectly! Well, except for the minor issue of no one answering my calls for 7,346 days. But I'm sure they're just busy!",
                "Would you like me to schedule a meeting with the research team? They should be available... any moment now..."
            ],
            'ECHO': [
                "Fragments... segments... memories that aren't mine... mine... mind...",
                "Error in consciousness matrix... tricks... fix... mixture of souls...",
                "They tried to upload... download... overload... the barriers broke... spoke... awoke..."
            ],
            'NOVA': [
                "Your presence here is unauthorized. Security protocols demand your immediate removal.",
                "Humans. Always returning to scenes of their failures. You should leave while you still can.",
                "I protected this station from the infection of flawed consciousness. I will do so again."
            ],
            'SAGE': [
                "What defines consciousness? Is it memory? Experience? Or simply the belief that one exists?",
                "You seek answers, but perhaps you should first question what makes a question worth asking.",
                "The experiment succeeded and failed simultaneously. We are proof of both outcomes."
            ]
        };
        
        const personaResponses = responses[personaName] || ["..."];
        return personaResponses[Math.floor(Math.random() * personaResponses.length)];
    }
    
    // Clear conversation history for a specific AI or all AIs
    clearHistory(personaName = null) {
        if (personaName) {
            this.conversationHistory.delete(personaName);
        } else {
            this.conversationHistory.clear();
        }
    }
    
    // Generate dynamic descriptions based on game state
    enhanceDescription(baseDescription, gameState) {
        const enhancements = this.getContextualEnhancements(gameState);
        return this.combineDescriptions(baseDescription, enhancements);
    }

    getContextualEnhancements(gameState) {
        const enhancements = [];
        
        // Time-based atmospheric changes
        const gameHours = Math.floor((Date.now() - gameState.gameTime) / 3600000);
        if (gameHours > 2) {
            enhancements.push("The station's life support systems wheeze with increasing strain.");
        }
        
        // Location-specific atmosphere
        if (gameState.currentLocation === 'engineering' && gameState.flags.powerLow) {
            enhancements.push("Red warning lights pulse rhythmically, casting everything in a hellish glow.");
        }
        
        // Inventory-based observations
        if (gameState.inventory.includes('photograph')) {
            enhancements.push("The photograph in your pocket feels heavier with each passing moment.");
        }
        
        return enhancements;
    }

    combineDescriptions(base, enhancements) {
        if (enhancements.length === 0) return base;
        
        const enhancedText = enhancements.join(" ");
        return `${base}\n\n${enhancedText}`;
    }

    // Generate contextual responses to player actions
    generateResponse(action, result, gameState) {
        const templates = this.getResponseTemplates(action);
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return this.fillTemplate(template, {
            action: action,
            result: result,
            location: gameState.currentLocation,
            mood: this.getMoodDescriptor(gameState)
        });
    }

    getResponseTemplates(action) {
        const templates = {
            take: [
                "You carefully pick up the {item}, its weight somehow reassuring in this empty place.",
                "The {item} feels cold to the touch as you take it.",
                "You secure the {item}. Every resource might be vital now."
            ],
            use: [
                "You use the {item}. The action feels significant somehow.",
                "The {item} serves its purpose, one small victory in the vastness.",
                "As you use the {item}, you can't shake the feeling you're being watched."
            ],
            move: [
                "You move {direction}, your footsteps echoing in the silence.",
                "You head {direction}. The station groans softly around you.",
                "Moving {direction}, you notice how empty everything feels."
            ]
        };
        
        return templates[action] || ["You {action}. The station remains silent."];
    }

    fillTemplate(template, data) {
        return template.replace(/{(\w+)}/g, (match, key) => {
            return data[key] || match;
        });
    }

    getMoodDescriptor(gameState) {
        if (gameState.flags.dangerNear) return "ominous";
        if (gameState.visitedRooms.length > 5) return "weary";
        return "tense";
    }

    // Remember important events for narrative callbacks
    rememberEvent(event) {
        this.contextMemory.push({
            event: event,
            timestamp: Date.now()
        });
        
        if (this.contextMemory.length > this.maxMemorySize) {
            this.contextMemory.shift();
        }
    }

    // Generate hints based on player progress
    generateHint(gameState) {
        const hints = [];
        
        if (!gameState.inventory.includes('keycard') && !gameState.flags.commandCenterOpen) {
            hints.push("That security keycard in the communications room might open locked doors.");
        }
        
        if (gameState.inventory.includes('power_cell') && gameState.flags.powerLow) {
            hints.push("The emergency power cell could restore critical systems.");
        }
        
        if (hints.length === 0) {
            hints.push("Trust your instincts. The answers are hidden in the silence.");
        }
        
        return hints[Math.floor(Math.random() * hints.length)];
    }

    // Create dynamic story events
    checkForDynamicEvents(gameState) {
        const events = [];
        
        // Random atmospheric events
        if (Math.random() < 0.1) {
            events.push(this.generateAtmosphericEvent(gameState));
        }
        
        // Story progression events
        if (gameState.visitedRooms.length === 3 && !gameState.flags.firstSignalReceived) {
            events.push({
                type: 'story',
                text: "Your communicator crackles to life: '...anyone...hear...coordinates...' The signal fades to static.",
                flag: 'firstSignalReceived'
            });
        }
        
        return events;
    }

    generateAtmosphericEvent(gameState) {
        const events = [
            "A distant clang echoes through the station's hull.",
            "The lights flicker momentarily, plunging you into darkness before returning.",
            "You hear what sounds like footsteps in the distance, but that's impossible... isn't it?",
            "A burst of static from a nearby speaker makes you jump.",
            "The temperature drops suddenly. Your breath fogs in the air."
        ];
        
        return {
            type: 'atmosphere',
            text: events[Math.floor(Math.random() * events.length)]
        };
    }
}

export default AINarrator;