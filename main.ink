=== START ===
# title: The Last Signal
# author: AI-Enhanced Interactive Fiction

VAR current_location = "Cryo Bay"
VAR signal_strength = 15
VAR consciousness_level = "disoriented"
VAR discovered_items = ()
VAR time_elapsed = 0

The cold hits you first. Then the silence.

Your eyes struggle to focus as the cryo-pod hisses open, releasing you from a dreamless sleep that lasted... how long? The ship's emergency lighting bathes everything in a sickly amber glow.

[AI_GENERATE:Describe the protagonist's physical sensations as they emerge from cryosleep, focusing on disorientation and gradual awareness]

* [Look around the cryo bay]
    -> examine_cryo_bay
    
* [Check your vital signs]
    -> check_vitals
    
* [Call out for help]
    -> call_for_help

=== examine_cryo_bay ===
~ current_location = "Cryo Bay"

The cryo bay stretches before you, a cathedral of ice and metal. Dozens of pods line the walls, their surfaces frosted with condensation. Most are dark. Some flicker with dying lights.

[AI_GENERATE:Describe the eerie atmosphere of the cryo bay with multiple pods, some clearly malfunctioning, creating a sense of isolation and dread]

* [Examine the other pods]
    -> check_other_pods
    
* [Look for an exit]
    -> find_exit
    
* [Check the bay's control panel]
    -> cryo_control_panel

=== check_vitals ===
Your neural implant flickers to life, displaying a heads-up display across your vision:

VITAL SIGNS:
- Heart Rate: 95 bpm [ELEVATED]
- Core Temperature: 35.8°C [BELOW NORMAL]
- Cognitive Function: 73% [IMPAIRED]
- Memory Integrity: ERROR - DATA CORRUPTED

[AI_GENERATE:Generate a concerning medical readout that hints at missing memories and the effects of extended cryosleep]

* [Try to remember why you're here]
    -> access_memories
    
* [Focus on the immediate situation]
    -> examine_cryo_bay

=== call_for_help ===
"Hello?" Your voice cracks, raw from disuse. "Is anyone there?"

The word echoes through the bay, bouncing off metal walls before being swallowed by an oppressive silence. Then, just as you're about to give up hope, you hear it.

A signal. Faint, rhythmic. Not quite human.

[AI_GENERATE:Describe a mysterious response to the call - could be electronic, organic, or something in between. Make it ambiguous and unsettling]

~ signal_strength = signal_strength + 10

* [Follow the signal]
    -> track_signal
    
* [Stay put and listen]
    -> analyze_signal
    
* [Back away cautiously]
    -> retreat_from_signal

=== check_other_pods ===
You approach the nearest pod, wiping away the frost with a trembling hand. The face inside is peaceful, almost serene, but something's wrong. The life support indicators show flatlines across the board.

Moving to the next pod, then the next, the pattern becomes horrifyingly clear.

[AI_GENERATE:Describe the gradual realization that most of the crew is dead, but hint that some pods show unusual readings or signs]

~ discovered_items = discovered_items + "crew_status"

* [Check pod #7 - showing anomalous readings]
    -> anomalous_pod
    
* [Search for survivors systematically]
    -> survivor_search
    
* [Leave the bay immediately]
    -> find_exit

=== find_exit ===
~ current_location = "Cryo Bay Exit"

The main door looms before you, its heavy blast shielding designed to withstand the vacuum of space. The control panel beside it flickers weakly, displaying a cascade of error messages.

DOOR STATUS: LOCKED
AUTHORIZATION REQUIRED
WARNING: Atmospheric anomaly detected beyond this point

[AI_GENERATE:Create tension around the locked door, suggesting something has gone very wrong with the ship]

* [Override the lock]
    -> hack_door
    
* [Look for another way out]
    -> alternate_route
    
* [Read the full error log]
    -> examine_errors

=== track_signal ===
You follow the signal, each pulse growing stronger as you move deeper into the bay. Your neural implant begins translating the pattern:

... .-.. . . .--. / -. --- / -- --- .-. .

"SLEEP NO MORE"

[AI_GENERATE:Describe following the signal to its source, building suspense about what's transmitting this message]

~ signal_strength = signal_strength + 20

* [Investigate the source]
    -> signal_source
    
* [Try to respond to the signal]
    -> communicate_signal
    
* [This feels wrong - retreat]
    -> tactical_withdrawal

=== access_memories ===
You close your eyes and dive into your neural storage, searching for answers. Fragments surface like bubbles in oil:

- A mission briefing. Something about a distress signal.
- The captain's worried face. "If we don't come back..."
- A star chart showing... nothing. A void where stars should be.
- A voice, not quite human: "They're coming through."

[AI_GENERATE:Create fragmented memories that hint at the mission's purpose and the danger they encountered]

~ consciousness_level = "remembering"

* [Focus on the distress signal memory]
    -> remember_signal
    
* [What did the captain mean?]
    -> remember_captain
    
* [Investigate the void on the star chart]
    -> remember_void

=== anomalous_pod ===
Pod #7 is different. Where others show flatlines or failing systems, this one pulses with impossible vitals:

Heart Rate: 0 bpm... 200 bpm... -40 bpm... ∞
Brain Activity: 340% baseline
Status: OCCUPIED/UNOCCUPIED/TRANSCENDENT

Inside, you see...

[AI_GENERATE:Describe what's in the anomalous pod - make it deeply unsettling and hint at transformation or possession]

* [Open the pod]
    -> open_anomalous_pod
    
* [Back away slowly]
    -> leave_pod_alone
    
* [Scan with your implant]
    -> deep_scan_pod

=== signal_source ===
The signal leads you to a section of the bay you hadn't noticed before. The walls here are different - covered in a substance that seems to shift between organic and mechanical, pulsing in rhythm with the signal.

At the center, a figure stands motionless. It might have been human once.

[AI_GENERATE:Describe the transformed figure and the alien environment around it, suggesting infection or alteration by something otherworldly]

* [Approach carefully]
    -> confront_figure
    
* [Try to communicate]
    -> speak_to_figure
    
* [This is a threat - find a weapon]
    -> seek_weapon

=== FUNCTION generate_ai_response(context, prompt) ===
// This function will be bound to the actual AI generation in JavaScript
~ return "{AI_RESPONSE}"

=== FUNCTION analyze_player_choice(choice, context) ===
// This function will analyze player choices for narrative branching
~ return "{CHOICE_ANALYSIS}"