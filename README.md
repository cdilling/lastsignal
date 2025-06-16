# The Last Signal - AI-Powered Text Adventure

An atmospheric sci-fi text adventure game that uses OpenAI's GPT-4 to dynamically generate story content, creating a unique narrative experience for each playthrough.

## Features

- **Dynamic AI Storytelling**: Uses GPT-4 to generate contextual descriptions, dialogue, and story branches
- **Ink Integration**: Built on the Ink narrative scripting language for robust story structure
- **Atmospheric UI**: Retro CRT monitor effects with customizable visual settings
- **Save System**: Auto-save and manual save/load functionality
- **Natural Language Input**: Parse both commands and free-form text input
- **Adaptive Narrative**: AI analyzes player choices to shape the story direction

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd the-last-signal
```

2. Install dependencies:
```bash
npm install
```

3. Install required packages:
```bash
npm install inkjs vite
```

### Running the Game

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. Enter your OpenAI API key when prompted

4. Begin your adventure!

## Project Structure

```
the-last-signal/
├── index.html          # Main HTML file with game UI
├── main.js            # Core game logic and integration
├── game-engine.js     # AI integration and game state management
├── parser.js          # Command parsing and input handling
├── save-system.js     # Save/load functionality
├── main.css          # Main styling
├── crt-effects.css   # CRT monitor effects
├── main.ink          # Ink story file with AI integration points
├── vite.config.js    # Vite configuration
└── README.md         # This file
```

## Game Controls

### Commands
- **Movement**: `go [direction]`, `n/s/e/w`, `enter`, `exit`
- **Interaction**: `look`, `examine [object]`, `take [item]`, `use [item]`
- **Communication**: `talk to [character]`, `say [text]`
- **System**: `save`, `load`, `help`, `inventory`

### Free-form Input
When prompted, you can type naturally to interact with the story. The AI will interpret your input and generate appropriate responses.

## Development

### Adding AI Generation Points

In the Ink file, use the special tag to trigger AI generation:
```ink
[AI_GENERATE:Your prompt for the AI to generate content]
```

### Modifying AI Behavior

Edit the `buildSystemPrompt()` method in `game-engine.js` to adjust the AI's tone, style, and behavior.

### Adding New Story Branches

Edit `main.ink` to add new story paths, choices, and AI integration points.

## Configuration

### API Settings
- Model: GPT-4 (configurable in `game-engine.js`)
- Temperature: 0.8 (adjust for more/less creative responses)
- Max tokens: 300 (adjust for longer/shorter responses)

### Visual Settings
- CRT effects can be toggled in-game
- Text speed is adjustable
- Sound effects (when implemented) can be toggled

## Troubleshooting

### API Key Issues
- Ensure your API key starts with `sk-`
- Check that your OpenAI account has credits
- Verify the API key has the necessary permissions

### Performance Issues
- Disable CRT effects for better performance
- Reduce text animation speed
- Check browser console for errors

### Story Issues
- If AI responses seem off, check the context being sent
- Adjust temperature settings for different response styles
- Ensure prompts are clear and specific

## Privacy & Security

- Your OpenAI API key is stored locally in your browser
- No data is sent to any server except OpenAI's API
- Game saves are stored in browser localStorage

## License

This project is provided as-is for educational and entertainment purposes.

## Credits

- Built with [Ink](https://www.inklestudios.com/ink/) by Inkle Studios
- Powered by OpenAI's GPT-4
- CRT effects inspired by retro terminal aesthetics

---

Enjoy your journey through The Last Signal. Remember: not all signals should be followed.