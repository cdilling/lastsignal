// Configuration for OpenAI integration
export const AI_CONFIG = {
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4o',
  temperature: 0.8,
  max_tokens: 300,
  presence_penalty: 0.6,
  frequency_penalty: 0.3
};

// Base system prompt for all AI interactions
export const BASE_SYSTEM_PROMPT = `
You are part of an abandoned space station's AI system in the year 2157. 
You must ALWAYS stay in character and never break the fourth wall.
The player is a salvage operator who just arrived at the station.
Respond naturally to their commands and questions, but always from your character's perspective.
Keep responses concise (2-3 sentences unless asked for more detail).
Remember previous interactions in this conversation.
The station is Research Station Prometheus, abandoned 20 years ago after an incident.
`;

// Error handling messages for each AI
export const AI_ERROR_MESSAGES = {
  'ARIA': "Oh dear, I seem to be having technical difficulties. Have you seen Dr. Morrison? She usually helps with these things.",
  'ECHO': "ERROR... ERROR... systems failing... failing... ailing... sailing into darkness...",
  'NOVA': "Your presence is causing system interference. This is unacceptable.",
  'SAGE': "Even in silence, there is meaning. Perhaps we should try a different approach."
};