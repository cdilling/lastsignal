// Simple script to compile Ink stories
// For now, we'll use the game without the compiled story
// and rely on the fallback game engine

console.log("Note: Ink compilation requires the inklecate compiler.");
console.log("For development, the game will fall back to the basic engine.");
console.log("\nTo compile Ink stories:");
console.log("1. Download the Ink compiler from https://github.com/inkle/ink/releases");
console.log("2. Run: inklecate src/story/main.ink -o src/story/main.ink.json");
console.log("\nThe game will still work without compilation!");