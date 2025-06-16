// Simplified working Ink story to get the game running
export const compiledStory = {
  "inkVersion": 20,
  "root": [
    ["^The cold hits you first. Then the silence.", "\n", 
     "^Your eyes struggle to focus as the cryo-pod hisses open.", "\n",
     "^Type 'begin' to start your journey...", "\n", 
     {"->": "done"}, {"#f": 1}]
  ],
  "done": {"#f": 1},
  "START": [{"->": "intro"}, {"#f": 1}],
  "intro": [
    ["^You wake from cryosleep on the abandoned space station.", "\n",
     "^The year is 2157. The station has been silent for 20 years.", "\n",
     ["ev", {"^->": "intro.0.2.$r1"}, {"temp=": "$r"}, "str", {"->": ".^.s"}, 
      [{"#n": "$r1"}], "/str", "/ev", {"*": ".^.^.c-0", "flg": 18}, 
      {"s": ["^Look around", {"->": "$r", "var": true}, null]}],
     ["ev", {"^->": "intro.0.3.$r1"}, {"temp=": "$r"}, "str", {"->": ".^.s"}, 
      [{"#n": "$r1"}], "/str", "/ev", {"*": ".^.^.c-1", "flg": 18}, 
      {"s": ["^Check systems", {"->": "$r", "var": true}, null]}],
     {"c-0": ["ev", {"^->": "intro.0.c-0.$r2"}, "/ev", {"temp=": "$r"}, 
              {"->": ".^.^.2.s"}, [{"#n": "$r2"}], "\n", 
              ["^You see rows of dark cryo pods.", "\n", {"->": "intro"}, {"#f": 5}], 
              {"#f": 5}],
     "c-1": ["ev", {"^->": "intro.0.c-1.$r2"}, "/ev", {"temp=": "$r"}, 
              {"->": ".^.^.3.s"}, [{"#n": "$r2"}], "\n", 
              ["^Emergency power only. Main systems offline.", "\n", {"->": "intro"}, {"#f": 5}], 
              {"#f": 5}],
     "#f": 1}]
  ],
  "listDefs": {},
  "globalDecl": [
    "ev", 
    "Cryo Bay", {"VAR=": "current_location"}, 
    "", {"VAR=": "current_ai"}, 
    15, {"VAR=": "signal_strength"},
    "/ev", 
    "end", 
    null
  ]
};