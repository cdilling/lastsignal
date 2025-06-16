// Working Ink story - starts directly with the game content
export const compiledStory = {
  "inkVersion": 20,
  "root": [
    "^The cold hits you first. Then the silence.",
    "\n",
    "\n",
    "^Your eyes struggle to focus as the cryo-pod hisses open, releasing you from a dreamless sleep that lasted... how long? The ship's emergency lighting bathes everything in a sickly amber glow.",
    "\n",
    "\n",
    "^As you stumble out of the pod, your legs barely support you. The metallic taste in your mouth and the burning in your lungs remind you that you're alive, though every nerve screams in protest.",
    "\n",
    "\n",
    ["ev", "str", "^Look around the cryo bay", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": ["^Look around the cryo bay", "\n", "\n", "^The cryo bay stretches before you, a cathedral of ice and metal. Dozens of pods line the walls, their surfaces frosted with condensation. Most are dark. Some flicker with dying lights.", "\n", "\n", "^You notice that your pod - Pod 7 - is one of only three still showing green status lights.", "\n", {"->": ".^.^.^"}, {"#f": 5}]}],
    ["ev", "str", "^Check your vital signs", "/str", "/ev", {"*": ".^.c-1", "flg": 4}, {"c-1": ["^Check your vital signs", "\n", "\n", "^Your neural implant flickers to life, overlaying your vision with biometric data:", "\n", "^- Heart rate: 142 bpm (elevated)", "\n", "^- O2 saturation: 89% (low)", "\n", "^- Core temp: 35.2°C (hypothermic)", "\n", "^- Cryo-recovery: 67% complete", "\n", "\n", "^WARNING: Seek medical attention.", "\n", {"->": ".^.^.^"}, {"#f": 5}]}],
    ["ev", "str", "^Call out for help", "/str", "/ev", {"*": ".^.c-2", "flg": 4}, {"c-2": ["^Call out for help", "\n", "\n", "^\"Hello? Is anyone there?\" Your voice comes out as barely a whisper, throat raw from disuse.", "\n", "\n", "^The only response is the echo of your own voice, bouncing off metal walls. Then, from somewhere deep in the ship, you hear it - a rhythmic tapping.", "\n", "\n", "^Tap. Tap. Tap.", "\n", "\n", "^It's too regular to be mechanical.", "\n", {"->": ".^.^.^"}, {"#f": 5}]}],
    {"#f": 1}
  ],
  "listDefs": {}
};