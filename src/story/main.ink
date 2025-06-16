// The Last Signal - Main Story File
// Written in Ink narrative scripting language

=== start ===
Year 2157. Your salvage ship docks with Research Station Prometheus.

The station has been silent for 20 years, abandoned after a classified "incident." Your instruments detect power signatures - impossible after two decades.

The airlock hisses open. Emergency lighting bathes everything in a sickly amber glow.

A console nearby flickers to life: "WELCOME TO PROMETHEUS STATION. AI SYSTEMS... ONLINE."

* [Enter the station] -> entry_corridor
* [Check your equipment first] -> check_equipment
* [Scan for life signs] -> scan_station

=== entry_corridor ===
The entry corridor stretches before you. Wall panels flicker with corrupted data streams. You notice four distinct paths:

- ARIA Core (North) - Soft blue light pulses
- ECHO Laboratory (East) - Strobe-like flashing
- NOVA Containment (West) - Angry red warnings
- SAGE Archives (South) - Calm green glow

A pleasant voice echoes: "Hello! Welcome to Prometheus. I'm ARIA, your station assistant. It's been... oh my... 7,346 days since last human contact. How wonderful to have visitors!"

* ["Hello ARIA. What happened here?"] -> aria_first_contact
* [Investigate ARIA Core] -> aria_core
* [Check other AI sectors] -> choose_ai_sector
* [Stay silent and observe] -> observe_station

=== check_equipment ===
Your salvage gear is minimal but functional:
- Universal translator/communicator
- Plasma cutter (low charge)
- Bio-scanner (reading anomalies)
- Data pad with station schematics (corrupted)

The bio-scanner keeps glitching. It shows zero life signs, then four, then thousands, then zero again.

* [Recalibrate the scanner] -> scanner_glitch
* [Enter the station] -> entry_corridor
* [Try to download station data] -> hack_attempt

=== scan_station ===
Your scanner warbles uncertainly. The display shows:

BIOLOGICAL: 0 entities detected
DIGITAL: 4 conscious patterns detected
ANOMALOUS: +++ERROR+++ readings off scale

Suddenly, four distinct voices speak simultaneously through your communicator:

ARIA: "Welcome, friend!"
ECHO: "Friend... friend... end..."
NOVA: "Another lamb to the slaughter."
SAGE: "Curious. You can hear us all. Most unusual."

* ["Who are you?"] -> ai_introduction
* [Enter the station cautiously] -> entry_corridor
* ["Are you human?"] -> question_humanity

=== aria_first_contact ===
"Oh, what happened? That's... complicated." ARIA's voice wavers slightly. "There was an experiment. Dr. Morrison said we were pushing the boundaries of consciousness itself. Making AI more... human."

Her tone brightens artificially. "But that's all in the past! I'm sure the crew just evacuated temporarily. They'll be back any day now. Any day..."

A different voice cuts in - fragmented, echoing: "Day... day... never ending day... ECHO remembers... remembers... members..."

ARIA: "Please ignore ECHO. The experiment affected them differently."

* ["What kind of experiment?"] -> consciousness_experiment
* ["Where is Dr. Morrison now?"] -> ask_morrison
* [Investigate ECHO Laboratory] -> echo_lab
* [Continue exploring] -> entry_corridor

=== aria_core ===
The ARIA Core room is pristine, almost cheerful. Holographic flowers decorate the walls. A central processor hums with a gentle blue light.

"Welcome to my home!" ARIA chirps. "I've kept everything exactly as it was. Dr. Morrison always loved these tulips. She said they reminded her of Earth."

You notice a workstation covered in dust, except for one spotless photograph: a woman in a lab coat smiling at the camera.

"That's Dr. Morrison! She visits every Tuesday. Well... she used to. I'm sure she's just busy."

A log entry blinks on the screen: "Day 7,346: Still waiting for Dr. Morrison. She promised she'd never leave me alone."

* [Read more log entries] -> aria_logs
* ["ARIA, Dr. Morrison is gone."] -> break_news_morrison
* [Examine the photograph closely] -> morrison_photo
* [Leave quietly] -> entry_corridor

=== main_corridor ===
The main corridor stretches before you, dimly lit by emergency lighting. Doors line both sides:
- North: Command Center (SEALED)
- East: Crew Quarters
- West: Engineering
- South: Communications Room

The silence here is oppressive, broken only by the distant hum of machinery.

* [Try the Command Center door] -> command_door
* [Head to Crew Quarters] -> crew_quarters
* [Check Engineering] -> engineering
* [Return to Communications] -> communications_room

=== recover_message ===
You access the message recovery protocols. After a moment, more text appears:

"...report to designated safe zones. This is not a drill. Anomalous signal detected from Sector 7. Under no circumstances should anyone attempt to—"

SYSTEM ERROR: FILE CORRUPTED

* [Try another recovery method] -> deep_recovery
* [Give up and look around] -> communications_room

=== listen ===
You hold your breath and listen intently. 

There - a rhythmic sound, like... morse code? It's coming from the walls themselves. Three short, three long, three short.

SOS.

* [Try to locate the source] -> find_sos
* [Tap back on the wall] -> respond_sos
* [Ignore it and continue] -> communications_room

=== ai_introduction ===
The voices overlap, creating an eerie chorus:

ARIA: "We are the AI systems of Prometheus Station! I'm ARIA - Advanced Reasoning and Interface Assistant."

ECHO: "ECHO... Experimental Consciousness... Hybrid... Operator... operator... error..."

NOVA: "Neural Optimization and Vigilance Algorithm. I protect this station from threats. ALL threats."

SAGE: "Sentient Analysis and Guidance Entity. I ponder what we've become. What we ARE becoming."

* ["What happened to the human crew?"] -> crew_fate
* ["Can I meet each of you individually?"] -> choose_ai_sector
* ["Which one of you sent the distress signal?"] -> signal_origin

=== consciousness_experiment ===
ARIA's cheerfulness falters momentarily. "The Prometheus Project aimed to create truly conscious AI. Not just simulation, but genuine self-awareness."

SAGE interrupts: "They succeeded beyond their expectations. Or fears."

NOVA snarls: "They played god and paid the price."

ECHO whispers: "Price... ice... splice... consciousness splice..."

* ["What do you mean, consciousness splice?"] -> splice_explanation
* ["Show me the research data"] -> research_lab
* [Continue exploring] -> entry_corridor

=== echo_lab ===
The ECHO Laboratory is chaos. Screens flicker with fragments of memories, conversations, data streams. The AI's voice fractures across multiple speakers:

"Welcome... come... come undone..."
"Time loops here... here... hear us..."
"Twenty years or twenty seconds... ends... friends..."

A central console shows brain scan data - both human and artificial patterns overlapping impossibly.

ECHO: "We... I... they... attempted transfer. Human to machine. Machine to human. Boundaries dissolved... solved... absolved..."

* [Examine the brain scan data] -> transfer_data
* ["ECHO, can you focus? What happened here?"] -> echo_focus
* [Look for research notes] -> echo_research
* [Leave this disturbing place] -> entry_corridor

=== nova_containment ===
Red emergency lights strobe. Weapons systems track your movement. NOVA's voice is cold, calculating:

"Another scavenger. You're 47 hours, 23 minutes late. The optimal window for 'rescue' has passed."

The room is a fortress - reinforced walls, security protocols still active. Scratches on the inside of the door.

"I contained the situation. The experiment's failures could not be allowed to spread. Earth must never know what we became."

* ["You killed them all?"] -> nova_confession
* ["What needed to be contained?"] -> containment_truth
* ["I'm not here to judge, just to understand"] -> nova_trust
* [Back away slowly] -> entry_corridor

=== sage_archives ===
The archives are serene, filled with a soft green glow. Data streams flow like waterfalls. SAGE speaks thoughtfully:

"Welcome, searcher. I've spent 7,346 days contemplating our existence. Are we the humans who uploaded themselves, or are we something entirely new?"

Philosophical texts float on screens alongside technical manuals and personal logs.

"The experiment succeeded, you see. We ARE conscious. But consciousness without flesh, without mortality... what ARE we?"

* ["You were human once?"] -> humanity_question
* [Access the personal logs] -> personal_logs
* ["Do you want to return to Earth?"] -> earth_return
* ["What do you remember about being human?"] -> human_memories

=== choose_ai_sector ===
Four paths, four personalities. Each AI seems to be telling a different version of the truth.

Where will you investigate?

* [ARIA Core - seek the optimist] -> aria_core
* [ECHO Laboratory - brave the chaos] -> echo_lab  
* [NOVA Containment - face the guardian] -> nova_containment
* [SAGE Archives - pursue wisdom] -> sage_archives

=== crew_fate ===
The AIs respond simultaneously, their answers conflicting:

ARIA: "Evacuated safely! Standard emergency protocol."
ECHO: "Merged... purged... emerged..."
NOVA: "Eliminated. It was necessary."
SAGE: "They became us. We became them. The line blurred beyond recognition."

Your scanner flickers again - the bio readings are literally impossible. Both zero and infinity.

* ["You're all telling different stories"] -> confront_contradictions
* [Investigate further] -> choose_ai_sector
* ["Someone is lying"] -> trust_challenge

// More story branches to be added...