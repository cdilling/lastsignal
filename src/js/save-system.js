// Save/Load system for game persistence
class SaveSystem {
    constructor() {
        this.storageKey = 'theLastSignal_saveData';
        this.autoSaveInterval = null;
        this.maxSaveSlots = 3;
    }

    // Save game state
    save(gameState, slotNumber = 0) {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                playTime: this.calculatePlayTime(gameState),
                gameState: gameState,
                slotNumber: slotNumber
            };

            const allSaves = this.getAllSaves();
            allSaves[slotNumber] = saveData;

            localStorage.setItem(this.storageKey, JSON.stringify(allSaves));
            
            return {
                success: true,
                message: `Game saved to slot ${slotNumber + 1}`
            };
        } catch (error) {
            console.error('Save failed:', error);
            return {
                success: false,
                message: 'Failed to save game'
            };
        }
    }

    // Load game state
    load(slotNumber = 0) {
        try {
            const allSaves = this.getAllSaves();
            const saveData = allSaves[slotNumber];

            if (!saveData) {
                return null;
            }

            // Version compatibility check
            if (!this.isCompatibleVersion(saveData.version)) {
                console.warn('Save file version mismatch');
                return null;
            }

            return saveData.gameState;
        } catch (error) {
            console.error('Load failed:', error);
            return null;
        }
    }

    // Get all save slots
    getAllSaves() {
        try {
            const savesJson = localStorage.getItem(this.storageKey);
            return savesJson ? JSON.parse(savesJson) : {};
        } catch (error) {
            console.error('Failed to retrieve saves:', error);
            return {};
        }
    }

    // Get save slot info
    getSaveInfo() {
        const allSaves = this.getAllSaves();
        const saveInfo = [];

        for (let i = 0; i < this.maxSaveSlots; i++) {
            if (allSaves[i]) {
                const save = allSaves[i];
                saveInfo.push({
                    slot: i,
                    timestamp: save.timestamp,
                    playTime: save.playTime,
                    location: save.gameState.currentLocation,
                    exists: true
                });
            } else {
                saveInfo.push({
                    slot: i,
                    exists: false
                });
            }
        }

        return saveInfo;
    }

    // Delete a save slot
    deleteSave(slotNumber) {
        try {
            const allSaves = this.getAllSaves();
            delete allSaves[slotNumber];
            localStorage.setItem(this.storageKey, JSON.stringify(allSaves));
            
            return {
                success: true,
                message: `Save slot ${slotNumber + 1} deleted`
            };
        } catch (error) {
            console.error('Delete failed:', error);
            return {
                success: false,
                message: 'Failed to delete save'
            };
        }
    }

    // Quick save (always uses slot 0)
    quickSave(gameState) {
        return this.save(gameState, 0);
    }

    // Quick load (always uses slot 0)
    quickLoad() {
        return this.load(0);
    }

    // Auto-save functionality
    enableAutoSave(gameEngine, interval = 60000) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            const state = gameEngine.getState();
            this.save(state, 0); // Auto-save always uses slot 0
        }, interval);
    }

    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    // Export save data
    exportSave(slotNumber = 0) {
        const allSaves = this.getAllSaves();
        const saveData = allSaves[slotNumber];

        if (!saveData) {
            return null;
        }

        const exportData = btoa(JSON.stringify(saveData));
        return exportData;
    }

    // Import save data
    importSave(exportData, slotNumber = 0) {
        try {
            const saveData = JSON.parse(atob(exportData));
            
            if (!this.isValidSaveData(saveData)) {
                return {
                    success: false,
                    message: 'Invalid save data'
                };
            }

            const allSaves = this.getAllSaves();
            allSaves[slotNumber] = saveData;
            localStorage.setItem(this.storageKey, JSON.stringify(allSaves));

            return {
                success: true,
                message: 'Save imported successfully'
            };
        } catch (error) {
            console.error('Import failed:', error);
            return {
                success: false,
                message: 'Failed to import save data'
            };
        }
    }

    // Utility functions
    calculatePlayTime(gameState) {
        if (!gameState.gameTime) return 0;
        return Math.floor((Date.now() - gameState.gameTime) / 1000); // Returns seconds
    }

    formatPlayTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    isCompatibleVersion(version) {
        // Simple version check - expand as needed
        const [major] = version.split('.');
        return major === '1';
    }

    isValidSaveData(data) {
        return data && 
               data.version && 
               data.timestamp && 
               data.gameState &&
               data.gameState.currentLocation &&
               data.gameState.inventory !== undefined;
    }

    // Clear all save data
    clearAllSaves() {
        try {
            localStorage.removeItem(this.storageKey);
            return {
                success: true,
                message: 'All saves cleared'
            };
        } catch (error) {
            console.error('Clear saves failed:', error);
            return {
                success: false,
                message: 'Failed to clear saves'
            };
        }
    }
}