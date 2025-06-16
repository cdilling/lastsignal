// Simple story system for The Last Signal
export class SimpleStory {
  constructor() {
    this.currentScene = 'start';
    this.gameStarted = false;
    
    this.scenes = {
      start: {
        text: `The cold hits you first. Then the silence.

Your eyes struggle to focus as the cryo-pod hisses open, releasing you from a dreamless sleep that lasted... how long? The ship's emergency lighting bathes everything in a sickly amber glow.

As you stumble out of the pod, your legs barely support you. The metallic taste in your mouth and the burning in your lungs remind you that you're alive, though every nerve screams in protest.`,
        choices: [
          { text: "Look around the cryo bay", next: "examine_cryo_bay" },
          { text: "Check your vital signs", next: "check_vitals" },
          { text: "Call out for help", next: "call_for_help" }
        ]
      },
      
      examine_cryo_bay: {
        text: `The cryo bay stretches before you, a cathedral of ice and metal. Dozens of pods line the walls, their surfaces frosted with condensation. Most are dark. Some flicker with dying lights.

You notice that your pod - Pod 7 - is one of only three still showing green status lights. The others... the frost on their windows is too thick to see through.`,
        choices: [
          { text: "Check the other active pods", next: "check_pods" },
          { text: "Look for an exit", next: "find_exit" },
          { text: "Examine the control panel", next: "control_panel" }
        ]
      },
      
      check_vitals: {
        text: `Your neural implant flickers to life, overlaying your vision with biometric data:
- Heart rate: 142 bpm (elevated)
- O2 saturation: 89% (low)
- Core temp: 35.2°C (hypothermic)
- Cryo-recovery: 67% complete

WARNING: Seek medical attention. Time in stasis: ERROR - DATA CORRUPTED`,
        choices: [
          { text: "Try to remember what happened", next: "remember" },
          { text: "Look for medical supplies", next: "find_medical" },
          { text: "Ignore the warnings and explore", next: "examine_cryo_bay" }
        ]
      },
      
      call_for_help: {
        text: `"Hello? Is anyone there?" Your voice comes out as barely a whisper, throat raw from disuse.

The only response is the echo of your own voice, bouncing off metal walls. Then, from somewhere deep in the ship, you hear it - a rhythmic tapping.

Tap. Tap. Tap.

It's too regular to be mechanical.`,
        choices: [
          { text: "Follow the sound", next: "follow_sound" },
          { text: "Call out again, louder", next: "call_louder" },
          { text: "Stay quiet and listen", next: "listen_carefully" }
        ]
      },
      
      check_pods: {
        text: `You approach the nearest active pod, wiping away the frost with a trembling hand. Inside, a woman floats in stasis fluid, her face peaceful. The display reads: "Dr. Sarah Chen - Xenobiologist - Status: Critical"

The second pod's occupant is harder to make out. The fluid inside has turned a murky brown. "Lt. Marcus Webb - Security Chief - Status: Corrupted"

Something moves inside Webb's pod.`,
        choices: [
          { text: "Try to wake Dr. Chen", next: "wake_chen" },
          { text: "Examine Webb's pod more closely", next: "examine_webb" },
          { text: "Back away from the pods", next: "find_exit" }
        ]
      },
      
      find_exit: {
        text: `The main door to the cryo bay stands before you, its surface covered in warning labels and hazard stripes. A terminal beside it blinks with an amber warning light.

"QUARANTINE PROTOCOL ACTIVE - AUTHORIZATION REQUIRED"

The keypad awaits input, but you have no memory of any codes.`,
        choices: [
          { text: "Try to force the door", next: "force_door" },
          { text: "Examine the terminal", next: "examine_terminal" },
          { text: "Look for another way out", next: "find_alternate" }
        ]
      },
      
      control_panel: {
        text: `The cryo bay's main control panel is a mess of blinking lights and error messages. Most concerning is the large display showing:

SHIP STATUS: ADRIFT
MAIN POWER: 12% (CRITICAL)
LIFE SUPPORT: EMERGENCY MODE
DISTRESS BEACON: ACTIVE - 73 DAYS

73 days. You've been drifting for over two months.`,
        choices: [
          { text: "Check the ship's logs", next: "check_logs" },
          { text: "Try to boost the distress signal", next: "boost_signal" },
          { text: "Look for crew manifest", next: "crew_manifest" }
        ]
      },
      
      remember: {
        text: `You close your eyes, trying to piece together fragments of memory...

The mission. You were part of the crew of the Prometheus, sent to investigate an anomalous signal from the edge of known space. But something went wrong. There was... screaming? An alarm?

The memories slip away like smoke.`,
        choices: [
          { text: "Continue exploring", next: "examine_cryo_bay" }
        ]
      },
      
      find_medical: {
        text: `A medical station is built into the wall near the pods. Most of the supplies have been used, but you find an emergency kit with stim injectors and oxygen supplements.

You inject yourself without hesitation. The rush is immediate - your vision sharpens, your breathing eases.`,
        choices: [
          { text: "Now examine the room properly", next: "examine_cryo_bay" },
          { text: "Check your vitals again", next: "check_vitals" }
        ]
      },
      
      // Add placeholder scenes
      follow_sound: {
        text: `You move toward the sound, each footstep echoing in the corridor. The tapping grows louder, more insistent...

[This path continues in the full game]`,
        choices: [
          { text: "Return to cryo bay", next: "examine_cryo_bay" }
        ]
      },
      
      wake_chen: {
        text: `You approach Dr. Chen's pod and begin the revival sequence. The pod hisses and begins to warm...

[This path continues in the full game]`,
        choices: [
          { text: "Wait for her to wake", next: "examine_cryo_bay" }
        ]
      }
    };
    
    // Add missing scenes with placeholders
    const placeholderScenes = [
      'call_louder', 'listen_carefully', 'examine_webb', 'force_door', 
      'examine_terminal', 'find_alternate', 'check_logs', 'boost_signal', 
      'crew_manifest'
    ];
    
    placeholderScenes.forEach(scene => {
      if (!this.scenes[scene]) {
        this.scenes[scene] = {
          text: `[This scene is coming soon in the full game]`,
          choices: [
            { text: "Go back", next: "examine_cryo_bay" }
          ]
        };
      }
    });
  }
  
  getCurrentScene() {
    return this.scenes[this.currentScene] || this.scenes.start;
  }
  
  makeChoice(choiceIndex) {
    const scene = this.getCurrentScene();
    if (scene.choices && scene.choices[choiceIndex]) {
      this.currentScene = scene.choices[choiceIndex].next;
      return true;
    }
    return false;
  }
  
  startGame() {
    this.gameStarted = true;
    this.currentScene = 'start';
  }
}