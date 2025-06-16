// Fixed Ink story with proper structure
export const compiledStory = {
  "inkVersion": 20,
  "root": [
    "^=== THE LAST SIGNAL ===",
    "\n",
    "^A sci-fi text adventure",
    "\n",
    "\n",
    "^Type 'begin' to start your journey...",
    "\n",
    "done",
    {"#f": 1}
  ],
  "start": [
    "^The cold hits you first. Then the silence.",
    "\n",
    "^Your eyes struggle to focus as the cryo-pod hisses open, releasing you from a dreamless sleep that lasted... how long?",
    "\n",
    ["ev", "str", "^Look around the cryo bay", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": ["^Look around the cryo bay", "\n", {"->": "cryo_bay"}, {"#f": 5}]}],
    ["ev", "str", "^Check your vital signs", "/str", "/ev", {"*": ".^.c-1", "flg": 4}, {"c-1": ["^Check your vital signs", "\n", {"->": "vitals"}, {"#f": 5}]}],
    ["ev", "str", "^Call out for help", "/str", "/ev", {"*": ".^.c-2", "flg": 4}, {"c-2": ["^Call out for help", "\n", "^You call out but hear only echoes.", "\n", {"->": "start"}, {"#f": 5}]}],
    {"#f": 1}
  ],
  "cryo_bay": [
    "^The cryo bay stretches before you, a cathedral of ice and metal.",
    "\n",
    "^Dozens of pods line the walls. Most are dark.",
    "\n",
    ["ev", "str", "^Examine the pods", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": ["^You see frost-covered pods.", "\n", {"->": "cryo_bay"}, {"#f": 5}]}],
    ["ev", "str", "^Return to start", "/str", "/ev", {"*": ".^.c-1", "flg": 4}, {"c-1": [{"->": "start"}, {"#f": 5}]}],
    {"#f": 1}
  ],
  "vitals": [
    "^Your neural implant displays:",
    "\n",
    "^- Heart rate: 142 bpm",
    "\n",
    "^- O2 saturation: 89%",
    "\n",
    "^- Core temp: 35.2°C",
    "\n",
    ["ev", "str", "^Continue", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": [{"->": "start"}, {"#f": 5}]}],
    {"#f": 1}
  ],
  "listDefs": {}
};