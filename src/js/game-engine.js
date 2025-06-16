// Core game engine for The Last Signal
class GameEngine {
    constructor() {
        this.gameState = {
            currentLocation: 'communications_room',
            inventory: [],
            flags: {},
            visitedRooms: [],
            gameTime: 0
        };
        
        this.locations = this.initializeLocations();
        this.items = this.initializeItems();
    }

    initializeLocations() {
        return {
            communications_room: {
                name: "Communications Room",
                description: "Banks of monitors flicker with static. A single terminal blinks with an urgent message. The main corridor lies to the north.",
                exits: { north: "main_corridor" },
                items: ["keycard", "logbook"],
                firstVisit: true
            },
            main_corridor: {
                name: "Main Corridor",
                description: "A long hallway stretches in both directions. Emergency lights cast eerie shadows on the walls.",
                exits: { 
                    south: "communications_room",
                    north: "command_center",
                    east: "crew_quarters",
                    west: "engineering"
                },
                items: [],
                firstVisit: true
            },
            command_center: {
                name: "Command Center",
                description: "The nerve center of Aurora-7. Captain's chair sits empty, screens still displaying the last known crew positions.",
                exits: { south: "main_corridor" },
                items: ["captain_log"],
                locked: true,
                firstVisit: true
            },
            crew_quarters: {
                name: "Crew Quarters",
                description: "Rows of bunks, all neatly made. Personal effects remain untouched, as if everyone simply vanished.",
                exits: { west: "main_corridor" },
                items: ["photograph"],
                firstVisit: true
            },
            engineering: {
                name: "Engineering",
                description: "The reactor hums steadily. Warning lights indicate several systems running on backup power.",
                exits: { east: "main_corridor" },
                items: ["wrench", "power_cell"],
                firstVisit: true
            }
        };
    }

    initializeItems() {
        return {
            keycard: {
                name: "security keycard",
                description: "A Level-3 security keycard. Still has dried blood on one corner.",
                takeable: true,
                useable: true
            },
            logbook: {
                name: "station logbook",
                description: "The last entry is from three days ago: 'Strange signals detected from Sector 7. Investigating.'",
                takeable: true,
                useable: false
            },
            captain_log: {
                name: "captain's log",
                description: "Personal recording device. The last entry is corrupted but you can make out: '...not alone...'",
                takeable: true,
                useable: true
            },
            photograph: {
                name: "photograph",
                description: "A photo of the crew at last year's celebration. Everyone looks so happy.",
                takeable: true,
                useable: false
            },
            wrench: {
                name: "heavy wrench",
                description: "A sturdy maintenance tool. Could be useful for repairs... or defense.",
                takeable: true,
                useable: true
            },
            power_cell: {
                name: "power cell",
                description: "A fully charged emergency power cell. Compatible with most station systems.",
                takeable: true,
                useable: true
            }
        };
    }

    startNewGame() {
        this.gameState.gameTime = Date.now();
        this.lookAround();
    }

    loadState(savedState) {
        this.gameState = savedState;
    }

    getState() {
        return this.gameState;
    }

    executeCommand(parsedCommand) {
        const { verb, object, preposition, indirect } = parsedCommand;

        switch(verb) {
            case 'look':
                return this.lookAround();
            case 'go':
            case 'move':
                return this.move(object);
            case 'take':
            case 'get':
                return this.takeItem(object);
            case 'drop':
                return this.dropItem(object);
            case 'use':
                return this.useItem(object, indirect);
            case 'inventory':
            case 'i':
                return this.showInventory();
            case 'examine':
            case 'x':
                return this.examine(object);
            case 'help':
                return this.showHelp();
            default:
                return "I don't understand that command. Type 'help' for available commands.";
        }
    }

    lookAround() {
        const location = this.locations[this.gameState.currentLocation];
        let description = `${location.name}\n${location.description}`;
        
        if (!this.gameState.visitedRooms.includes(this.gameState.currentLocation)) {
            this.gameState.visitedRooms.push(this.gameState.currentLocation);
        }

        if (location.items.length > 0) {
            description += "\n\nYou can see: " + location.items.map(item => 
                this.items[item].name
            ).join(", ");
        }

        const exits = Object.keys(location.exits);
        description += "\n\nExits: " + exits.join(", ");

        return description;
    }

    move(direction) {
        const location = this.locations[this.gameState.currentLocation];
        
        if (!direction) {
            return "Move where? Specify a direction.";
        }

        if (location.exits[direction]) {
            const newLocation = location.exits[direction];
            
            if (this.locations[newLocation].locked) {
                return "That area is locked. You'll need to find a way to unlock it.";
            }

            this.gameState.currentLocation = newLocation;
            return this.lookAround();
        } else {
            return "You can't go that way.";
        }
    }

    takeItem(itemName) {
        if (!itemName) {
            return "Take what?";
        }

        const location = this.locations[this.gameState.currentLocation];
        const itemKey = Object.keys(this.items).find(key => 
            this.items[key].name === itemName
        );

        if (itemKey && location.items.includes(itemKey)) {
            if (this.items[itemKey].takeable) {
                location.items = location.items.filter(item => item !== itemKey);
                this.gameState.inventory.push(itemKey);
                return `You take the ${itemName}.`;
            } else {
                return "You can't take that.";
            }
        } else {
            return "You don't see that here.";
        }
    }

    dropItem(itemName) {
        if (!itemName) {
            return "Drop what?";
        }

        const itemKey = Object.keys(this.items).find(key => 
            this.items[key].name === itemName
        );

        if (itemKey && this.gameState.inventory.includes(itemKey)) {
            this.gameState.inventory = this.gameState.inventory.filter(item => item !== itemKey);
            this.locations[this.gameState.currentLocation].items.push(itemKey);
            return `You drop the ${itemName}.`;
        } else {
            return "You're not carrying that.";
        }
    }

    useItem(itemName, target) {
        if (!itemName) {
            return "Use what?";
        }

        const itemKey = Object.keys(this.items).find(key => 
            this.items[key].name === itemName
        );

        if (!itemKey || !this.gameState.inventory.includes(itemKey)) {
            return "You're not carrying that.";
        }

        if (!this.items[itemKey].useable) {
            return "You can't use that.";
        }

        // Special use cases
        if (itemKey === 'keycard' && this.gameState.currentLocation === 'main_corridor') {
            this.locations.command_center.locked = false;
            return "You swipe the keycard. The command center door hisses open.";
        }

        if (itemKey === 'captain_log') {
            return "You play the captain's log. Through the static you hear: 'Day 47... crew reporting strange dreams... the signal... it's not from Earth...'";
        }

        return "You can't use that here.";
    }

    showInventory() {
        if (this.gameState.inventory.length === 0) {
            return "You're not carrying anything.";
        }

        const items = this.gameState.inventory.map(itemKey => 
            this.items[itemKey].name
        ).join("\n");

        return "You are carrying:\n" + items;
    }

    examine(objectName) {
        if (!objectName) {
            return "Examine what?";
        }

        // Check inventory
        const invItemKey = Object.keys(this.items).find(key => 
            this.items[key].name === objectName && this.gameState.inventory.includes(key)
        );

        if (invItemKey) {
            return this.items[invItemKey].description;
        }

        // Check current location
        const location = this.locations[this.gameState.currentLocation];
        const locItemKey = Object.keys(this.items).find(key => 
            this.items[key].name === objectName && location.items.includes(key)
        );

        if (locItemKey) {
            return this.items[locItemKey].description;
        }

        return "You don't see that here.";
    }

    showHelp() {
        return `Available commands:
- look: Examine your surroundings
- go [direction]: Move in a direction (north, south, east, west)
- take [item]: Pick up an item
- drop [item]: Drop an item
- use [item]: Use an item
- examine [item]: Look closely at something
- inventory: Check what you're carrying
- help: Show this help message`;
    }
}