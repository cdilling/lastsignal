// Ultra-simple test story
export const compiledStory = {
  "inkVersion": 20,
  "root": [
    "^Welcome to the game!",
    "\n",
    ["ev", "str", "^Choice 1", "/str", "/ev", {"*": ".^.c-0", "flg": 4}, {"c-0": ["^You picked choice 1!", "\n", "end", {"#f": 5}]}],
    ["ev", "str", "^Choice 2", "/str", "/ev", {"*": ".^.c-1", "flg": 4}, {"c-1": ["^You picked choice 2!", "\n", "end", {"#f": 5}]}],
    {"#f": 1}
  ],
  "listDefs": {}
};