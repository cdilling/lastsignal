// Dynamic story loader that preserves all AI integration
import { Story } from 'inkjs';

// The complete Ink story with AI integration points
export const inkStoryText = `
# title: The Last Signal
# author: AI-Enhanced Interactive Fiction

VAR current_location = "Cryo Bay"
VAR current_ai = ""
VAR last_player_input = ""
VAR signal_strength = 15
VAR consciousness_level = "disoriented"
VAR discovered_items = ()
VAR time_elapsed = 0

=== START ===
The cold hits you first. Then the silence.

Your eyes struggle to focus as the cryo-pod hisses open, releasing you from a dreamless sleep that lasted... how long? The ship's emergency lighting bathes everything in a sickly amber glow.

As you stumble out of the pod, your legs barely support you. The metallic taste in your mouth and the burning in your lungs remind you that you're alive, though every nerve screams in protest.

* [Look around the cryo bay]
    -> examine_cryo_bay
    
* [Check your vital signs]
    -> check_vitals
    
* [Call out for help]
    -> call_for_help

=== examine_cryo_bay ===
~ current_location = "Cryo Bay"

The cryo bay stretches before you, a cathedral of ice and metal. Dozens of pods line the walls, their surfaces frosted with condensation. Most are dark. Some flicker with dying lights.

You notice that your pod - Pod 7 - is one of only three still showing green status lights. The others... the frost on their windows is too thick to see through.

* [Check the other active pods]
    -> check_pods
* [Look for an exit]
    -> find_exit
* [Examine the control panel]
    -> control_panel

=== check_vitals ===
Your neural implant flickers to life, overlaying your vision with biometric data:
- Heart rate: 142 bpm (elevated)
- O2 saturation: 89% (low)
- Core temp: 35.2°C (hypothermic)
- Cryo-recovery: 67% complete

WARNING: Seek medical attention. Time in stasis: ERROR - DATA CORRUPTED

* [Try to remember what happened]
    -> remember
* [Look for medical supplies]
    -> find_medical
* [Ignore the warnings and explore]
    -> examine_cryo_bay

=== call_for_help ===
"Hello? Is anyone there?" Your voice comes out as barely a whisper, throat raw from disuse.

The only response is the echo of your own voice, bouncing off metal walls. Then, from somewhere deep in the ship, you hear it - a rhythmic tapping. 

Tap. Tap. Tap.

It's too regular to be mechanical.

* [Follow the sound]
    -> follow_sound
* [Call out again, louder]
    -> call_louder
* [Stay quiet and listen]
    -> listen_carefully

=== check_pods ===
You approach the nearest active pod, wiping away the frost with a trembling hand. Inside, a woman floats in stasis fluid, her face peaceful. The display reads: "Dr. Sarah Chen - Xenobiologist - Status: Critical"

The second pod's occupant is harder to make out. The fluid inside has turned a murky brown. "Lt. Marcus Webb - Security Chief - Status: Corrupted"

Something moves inside Webb's pod.

* [Try to wake Dr. Chen]
    -> wake_chen
* [Examine Webb's pod more closely]
    -> examine_webb
* [Back away from the pods]
    -> find_exit

=== find_exit ===
The main door to the cryo bay stands before you, its surface covered in warning labels and hazard stripes. A terminal beside it blinks with an amber warning light.

"QUARANTINE PROTOCOL ACTIVE - AUTHORIZATION REQUIRED"

The keypad awaits input, but you have no memory of any codes.

* [Try to force the door]
    -> force_door
* [Examine the terminal]
    -> examine_terminal
* [Look for another way out]
    -> find_alternate

=== control_panel ===
The cryo bay's main control panel is a mess of blinking lights and error messages. Most concerning is the large display showing:

SHIP STATUS: ADRIFT
MAIN POWER: 12% (CRITICAL)
LIFE SUPPORT: EMERGENCY MODE
DISTRESS BEACON: ACTIVE - 73 DAYS

73 days. You've been drifting for over two months.

* [Check the ship's logs]
    -> check_logs
* [Try to boost the distress signal]
    -> boost_signal
* [Look for crew manifest]
    -> crew_manifest

=== remember ===
You close your eyes, trying to piece together fragments of memory...

The mission. You were part of the crew of the Prometheus, sent to investigate an anomalous signal from the edge of known space. But something went wrong. There was... screaming? An alarm?

The memories slip away like smoke.

-> examine_cryo_bay

=== find_medical ===
A medical station is built into the wall near the pods. Most of the supplies have been used, but you find an emergency kit with stim injectors and oxygen supplements.

You inject yourself without hesitation. The rush is immediate - your vision sharpens, your breathing eases.

* [Now examine the room properly]
    -> examine_cryo_bay
* [Check your vitals again]
    -> check_vitals

=== follow_sound ===
You move toward the sound, each footstep echoing in the corridor beyond the cryo bay. The tapping grows louder, more insistent.

As you round a corner, you see a figure at the end of the hallway, silhouetted against flickering lights. They're tapping on the wall with something metal.

They haven't noticed you yet.

* [Approach carefully]
    -> approach_figure
* [Call out to them]
    -> call_figure
* [Hide and observe]
    -> hide_observe

=== wake_chen ===
~ current_location = "Medical Bay"
You approach Dr. Chen's pod and begin the emergency revival sequence. The pod hisses as warming fluids circulate.

After several tense minutes, her eyes flutter open. She gasps, coughing up stasis fluid.

"Where... where is everyone?" she whispers, her voice hoarse.

* ["I don't know. I just woke up too."]
    -> chen_conversation_1
* ["The station's been abandoned for 20 years."]
    -> chen_conversation_2
* ["Are you alright? Can you stand?"]
    -> chen_conversation_3

=== examine_terminal ===
~ current_location = "Terminal Interface"
The terminal flickers to life as you approach. A cheerful voice fills the air:

"Good morning! I'm ARIA, your administrative assistant. Oh my, you're not on the access list. Let me just... oh. Oh dear. Dr. Morrison, is that you? You look different."

~ current_ai = "ARIA"

* ["I'm not Dr. Morrison. The station's been abandoned."]
    ~ last_player_input = "I'm not Dr. Morrison. The station's been abandoned."
    -> aria_response
* ["Can you open this door?"]
    ~ last_player_input = "Can you open this door?"
    -> aria_response
* ["What happened here?"]
    ~ last_player_input = "What happened here?"
    -> aria_response

=== aria_response ===
[AI_RESPONSE]

~ current_ai = "ARIA"

* [Continue talking to ARIA]
    -> aria_conversation
* [Try a different approach]
    -> examine_terminal_options
* [Leave the terminal]
    -> find_exit

=== aria_conversation ===
What would you like to say to ARIA?

* ["Tell me about the research being conducted here."]
    ~ last_player_input = "Tell me about the research being conducted here."
    -> aria_response
* ["What's the last thing you remember?"]
    ~ last_player_input = "What's the last thing you remember?"
    -> aria_response
* ["Can you contact the other AIs?"]
    ~ last_player_input = "Can you contact the other AIs?"
    -> aria_response

=== call_louder ===
You clear your throat and call out again, louder this time. "IS ANYONE THERE? I NEED HELP!"

The tapping stops.

Then, from multiple directions at once, you hear voices - distorted, mechanical, overlapping:

"Help... help... help..."
"Who disturbs the silence?"
"Another one awakens..."
"Turn back while you can..."

* [Stand your ground] -> face_voices
* [Run back to the cryo bay] -> retreat_cryo
* [Try to locate one specific voice] -> track_voice

=== listen_carefully ===
You remain perfectly still, straining to hear more. The tapping continues its steady rhythm. Then you notice something else - a whispered counting between each tap:

"Seventy-one... seventy-two... seventy-three..."

The counting matches the days on the distress beacon.

* [Approach the source] -> follow_sound
* [Call out "Seventy-four"] -> join_counting
* [Continue listening] -> hear_more

=== chen_conversation_1 ===
Dr. Chen struggles to sit up, her movements weak and uncoordinated. "The experiment... did it work? Where's Dr. Morrison?"

She looks around the medical bay with growing alarm. "This isn't right. The pods shouldn't be... why are so many dark?"

* ["What experiment? What were you working on?"] -> chen_explains
* ["Dr. Morrison might be the one tapping in the corridor."] -> chen_worried
* ["We need to get you somewhere safe first."] -> chen_help

=== chen_conversation_2 ===
"Twenty years?" Dr. Chen's face goes pale. "No, that's not... the emergency protocols would have..." She trails off, staring at the dark pods.

"The consciousness transfer project. We were so close to a breakthrough. If it's been twenty years, then the subjects..." Her eyes widen in horror.

* ["What subjects? What did you do?"] -> chen_revelation
* ["Are you saying there are people trapped in the system?"] -> chen_trapped
* ["We need to find out what happened."] -> chen_investigate

=== examine_webb ===
You lean closer to Webb's pod, trying to see through the murky fluid. The shape inside is... wrong. Too many angles. Movement where there shouldn't be any.

The pod's display flickers:
"Lt. Marcus Webb - Security Chief - Status: Ċ̸̱ö̸͇́r̶̺̈r̷̪̾ǘ̶̜p̶̱̏t̸̬̾ë̵́ͅd̶̜̈"

The thing inside presses against the glass. You see an eye - human, terrified - before it's pulled back into the dark.

* [Try to drain the pod] -> drain_webb
* [Back away slowly] -> webb_retreat
* [Look for Webb's records] -> check_webb_data

=== force_door ===
You slam your shoulder against the door. It doesn't budge. You try again, harder. On the third attempt, something gives - not the door, but the wall panel beside it.

A hidden compartment opens, revealing an old security keycard and a handwritten note:

"If you're reading this, they've already won. The AIs have taken control. Don't trust any of them - not even ARIA. The real crew is in Lab 7. FIND US. - Commander Hayes"

* [Take the keycard and find Lab 7] -> seek_lab7
* [Try the keycard on the door] -> use_keycard
* [Examine the note more closely] -> examine_note

-> END
`;

// Function to compile Ink story
export function loadInkStory() {
  try {
    const story = new Story(inkStoryText);
    return story;
  } catch (error) {
    console.error('Failed to load Ink story:', error);
    // Return null so the game can handle the error gracefully
    return null;
  }
}