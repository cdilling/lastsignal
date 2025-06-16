export class GameEngine {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.model = import.meta.env.VITE_AI_MODEL || 'gpt-4o';
    this.gameState = {
      mood: 'mysterious',
      tension: 5,
      playerTraits: [],
      discoveries: [],
      relationships: {}
    };
  }

  async validateApiKey() {
    if (!this.apiKey) return false;
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'Test' },
            { role: 'user', content: 'Test' }
          ],
          max_tokens: 1
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('API validation error:', error);
      return false;
    }
  }

  async generateAIResponse(context, prompt) {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(context, prompt);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 300,
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI generation error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  buildSystemPrompt() {
    return `You are the AI narrator for "The Last Signal", a mysterious sci-fi text adventure game. 
    You should:
    - Maintain a tense, atmospheric tone
    - Use vivid, sensory descriptions
    - Keep responses concise (2-3 paragraphs max)
    - React dynamically to player choices
    - Introduce subtle mysteries and clues
    - Never break character or mention you're an AI
    - Build on established story elements
    Current mood: ${this.gameState.mood}
    Current tension level: ${this.gameState.tension}/10`;
  }

  buildUserPrompt(context, prompt) {
    return `Story context:
    Location: ${context.location}
    Recent events: ${context.history}
    
    Generate a response for: ${prompt}
    
    Make sure to maintain continuity with the established story.`;
  }

  async analyzePlayerChoice(choice, context) {
    // Analyze player choice to update game state
    try {
      const analysis = await this.performAnalysis(choice, context);
      this.updateGameState(analysis);
      return analysis;
    } catch (error) {
      console.error('Analysis error:', error);
      return { impact: 'neutral', traits: [] };
    }
  }

  async performAnalysis(choice, context) {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Analyze the player choice in the context of a sci-fi adventure game. Return a JSON object with: impact (positive/negative/neutral), traits (array of personality traits shown), and tension_change (-2 to +2).'
          },
          {
            role: 'user',
            content: `Choice: "${choice}"\nContext: ${JSON.stringify(context)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  updateGameState(analysis) {
    // Update tension
    if (analysis.tension_change) {
      this.gameState.tension = Math.max(0, Math.min(10, 
        this.gameState.tension + analysis.tension_change));
    }

    // Track player traits
    if (analysis.traits && Array.isArray(analysis.traits)) {
      analysis.traits.forEach(trait => {
        if (!this.gameState.playerTraits.includes(trait)) {
          this.gameState.playerTraits.push(trait);
        }
      });
    }

    // Adjust mood based on impact
    if (analysis.impact === 'positive') {
      this.gameState.mood = 'hopeful';
    } else if (analysis.impact === 'negative') {
      this.gameState.mood = 'ominous';
    }
  }

  getFallbackResponse(prompt) {
    const fallbacks = [
      "The interference grows stronger, making it hard to process what's happening...",
      "Static fills your mind as you try to comprehend the situation...",
      "The signal wavers, leaving you momentarily disoriented...",
      "For a moment, everything becomes unclear..."
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Story-specific methods
  generateDescription(item, style = 'detailed') {
    const prompts = {
      detailed: `Describe ${item} in rich, atmospheric detail suitable for a sci-fi mystery.`,
      brief: `Briefly describe ${item} in one sentence.`,
      examining: `Describe what the player discovers when closely examining ${item}.`
    };

    return this.generateAIResponse(
      { location: this.gameState.currentLocation },
      prompts[style] || prompts.detailed
    );
  }

  generateLocation(locationName, features = []) {
    const featureList = features.join(', ');
    const prompt = `Describe the ${locationName} area of a mysterious space station. 
                   Key features: ${featureList}. 
                   Make it atmospheric and slightly unsettling.`;
    
    return this.generateAIResponse(
      { location: locationName },
      prompt
    );
  }

  generateNPCDialogue(npcName, context, playerInput) {
    const npcPersonality = this.getNPCPersonality(npcName);
    const prompt = `As ${npcName} (${npcPersonality}), respond to: "${playerInput}"
                   Keep the response in character and advance the mystery.`;
    
    return this.generateAIResponse(context, prompt);
  }

  getNPCPersonality(npcName) {
    const personalities = {
      'Dr. Chen': 'anxious scientist, knows more than they let on',
      'Captain Torres': 'stern but caring, protective of crew',
      'ARIA': 'ship AI, helpful but occasionally glitches',
      'Unknown Voice': 'mysterious, speaks in riddles'
    };
    
    return personalities[npcName] || 'mysterious figure';
  }

  // Save/Load state
  getState() {
    return { ...this.gameState };
  }

  setState(state) {
    this.gameState = { ...this.gameState, ...state };
  }
}