export class SaveSystem {
  constructor() {
    this.storageKey = 'lastSignal_saves';
    this.maxSaves = 10;
    this.autoSaveInterval = 60000; // Auto-save every minute
    this.autoSaveTimer = null;
  }

  // Save game state
  save(slotName, gameData) {
    try {
      const saves = this.getAllSaves();
      const saveEntry = {
        slotName,
        timestamp: new Date().toISOString(),
        playTime: this.calculatePlayTime(gameData),
        data: gameData
      };

      // Add or update save
      const existingIndex = saves.findIndex(save => save.slotName === slotName);
      if (existingIndex !== -1) {
        saves[existingIndex] = saveEntry;
      } else {
        saves.push(saveEntry);
      }

      // Limit number of saves
      if (saves.length > this.maxSaves) {
        saves.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        saves.length = this.maxSaves;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(saves));
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }

  // Load game state
  load(slotName) {
    try {
      const saves = this.getAllSaves();
      const save = saves.find(s => s.slotName === slotName);
      return save ? save.data : null;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  }

  // Get all saves
  getAllSaves() {
    try {
      const savesJson = localStorage.getItem(this.storageKey);
      return savesJson ? JSON.parse(savesJson) : [];
    } catch (error) {
      console.error('Failed to retrieve saves:', error);
      return [];
    }
  }

  // Delete a save
  deleteSave(slotName) {
    try {
      const saves = this.getAllSaves();
      const filtered = saves.filter(save => save.slotName !== slotName);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  // Quick save (overwrites slot)
  quickSave(gameData) {
    return this.save('quicksave', gameData);
  }

  // Quick load
  quickLoad() {
    return this.load('quicksave');
  }

  // Auto-save functionality
  startAutoSave(gameDataCallback) {
    this.stopAutoSave(); // Clear any existing timer
    
    this.autoSaveTimer = setInterval(() => {
      const gameData = gameDataCallback();
      if (gameData) {
        this.save('autosave', gameData);
        console.log('Auto-save completed');
      }
    }, this.autoSaveInterval);
  }

  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Calculate play time from game data
  calculatePlayTime(gameData) {
    if (gameData.startTime) {
      const start = new Date(gameData.startTime);
      const now = new Date();
      const diff = now - start;
      return Math.floor(diff / 1000); // Return seconds
    }
    return 0;
  }

  // Format save for display
  formatSaveForDisplay(save) {
    const date = new Date(save.timestamp);
    const playTime = this.formatPlayTime(save.playTime);
    
    return {
      name: save.slotName,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      playTime: playTime,
      location: save.data.location || 'Unknown'
    };
  }

  // Format play time for display
  formatPlayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Export save to file
  exportSave(slotName) {
    const save = this.load(slotName);
    if (!save) return false;

    const dataStr = JSON.stringify(save, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lastsignal_save_${slotName}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  }

  // Import save from file
  async importSave(file) {
    try {
      const text = await file.text();
      const saveData = JSON.parse(text);
      
      // Validate save data structure
      if (!this.validateSaveData(saveData)) {
        throw new Error('Invalid save file format');
      }
      
      // Generate unique slot name for imported save
      const slotName = `imported_${Date.now()}`;
      return this.save(slotName, saveData);
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Validate save data structure
  validateSaveData(data) {
    // Check for required fields
    const requiredFields = ['story', 'timestamp'];
    return requiredFields.every(field => field in data);
  }

  // Clear all saves
  clearAllSaves() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Clear saves failed:', error);
      return false;
    }
  }

  // Get save slots info
  getSaveSlots() {
    const saves = this.getAllSaves();
    return saves.map(save => this.formatSaveForDisplay(save));
  }

  // Check if save slot exists
  saveExists(slotName) {
    const saves = this.getAllSaves();
    return saves.some(save => save.slotName === slotName);
  }
}