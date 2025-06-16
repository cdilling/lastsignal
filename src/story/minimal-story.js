// Minimal working Ink story in proper JSON format
export const compiledStory = {
  "inkVersion": 20,
  "root": [
    "^=== THE LAST SIGNAL ===",
    "\n",
    "^A sci-fi text adventure",
    "\n",
    "\n",
    "^Type \"begin\" or \"wake up\" to start your journey...",
    "\n",
    "^Type \"help\" for available commands.",
    "\n",
    {"->": "START"},
    {"#f": 1}
  ],
  "START": [
    "^The cold hits you first. Then the silence.",
    "\n",
    "^Your eyes struggle to focus as the cryo-pod hisses open, releasing you from a dreamless sleep that lasted... how long? The ship's emergency lighting bathes everything in a sickly amber glow.",
    "\n",
    "^As you stumble out of the pod, your legs barely support you. The metallic taste in your mouth and the burning in your lungs remind you that you're alive, though every nerve screams in protest.",
    "\n",
    ["ev", "str", "^Look around the cryo bay", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": ["^Look around the cryo bay", "\n", {"->": "cryo_bay"}, {"#f": 5}]}],
    ["ev", "str", "^Check your vital signs", "/str", "/ev", {"*": ".^.c-1", "flg": 4}, {"c-1": ["^Check your vital signs", "\n", {"->": "check_vitals"}, {"#f": 5}]}],
    ["ev", "str", "^Call out for help", "/str", "/ev", {"*": ".^.c-2", "flg": 4}, {"c-2": ["^Call out for help", "\n", {"->": "call_for_help"}, {"#f": 5}]}],
    {"#f": 1}
  ],
  "cryo_bay": [
    "^The cryo bay stretches before you, a cathedral of ice and metal. Dozens of pods line the walls, their surfaces frosted with condensation. Most are dark. Some flicker with dying lights.",
    "\n",
    "^You notice that your pod - Pod 7 - is one of only three still showing green status lights. The others... the frost on their windows is too thick to see through.",
    "\n",
    ["ev", "str", "^Check the other active pods", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": ["^Check the other active pods", "\n", "^You approach the nearest active pod...", "\n", {"->": "cryo_bay"}, {"#f": 5}]}],
    ["ev", "str", "^Look for an exit", "/str", "/ev", {"*": ".^.c-1", "flg": 4}, {"c-1": ["^Look for an exit", "\n", "^You see a door marked 'Main Corridor'...", "\n", {"->": "cryo_bay"}, {"#f": 5}]}],
    ["ev", "str", "^Examine the control panel", "/str", "/ev", {"*": ".^.c-2", "flg": 4}, {"c-2": ["^Examine the control panel", "\n", "^The display shows: SHIP STATUS: ADRIFT", "\n", {"->": "cryo_bay"}, {"#f": 5}]}],
    {"#f": 1}
  ],
  "check_vitals": [
    "^Your neural implant flickers to life, overlaying your vision with biometric data:",
    "\n",
    "^- Heart rate: 142 bpm (elevated)",
    "\n",
    "^- O2 saturation: 89% (low)",
    "\n",
    "^- Core temp: 35.2°C (hypothermic)",
    "\n",
    "^- Cryo-recovery: 67% complete",
    "\n",
    "^WARNING: Seek medical attention. Time in stasis: ERROR - DATA CORRUPTED",
    "\n",
    {"->": "START"},
    {"#f": 1}
  ],
  "call_for_help": [
    "^\"Hello? Is anyone there?\" Your voice comes out as barely a whisper, throat raw from disuse.",
    "\n",
    "^The only response is the echo of your own voice, bouncing off metal walls. Then, from somewhere deep in the ship, you hear it - a rhythmic tapping.",
    "\n",
    "^Tap. Tap. Tap.",
    "\n",
    "^It's too regular to be mechanical.",
    "\n",
    {"->": "START"},
    {"#f": 1}
  ],
  "done": [
    "^To be continued...",
    "\n",
    {"#f": 1}
  ],
  "global decl": [
    "ev",
    "str", "^Cryo Bay", "/str", {"VAR=": "current_location"},
    "str", "^", "/str", {"VAR=": "current_ai"},
    15, {"VAR=": "signal_strength"},
    "/ev",
    "end",
    null
  ],
  "listDefs": {}
};