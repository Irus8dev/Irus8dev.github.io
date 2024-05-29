# AI Prompts to help you create the flashcard quizzes
## Create Quizzes based on Study Content (Tested with Gemini)
```text
Based on the '''Study List''' below, Create 30 quizzes. Each question should follow this comma-delimited format:
Format:
Question,Selection1;Selection2;Selection3;...,Answer
Examples:
What is the smallest state in the USA?, MA;TX;RI;ME, RI
What force keeps planets in orbit around the sun?, Gravity;Magnetism;Friction;Inertia, Gravity

'''Study List'''
*** Your study note goes here ****
```

## Create Quizzes based on topics (Tested with Bing/CoPilot)

#### General Template
Create {{number of questions}} questionnaires about {{topic}}. Question number is not necessary.
Format:
Question,Selection1;Selection2;Selection3;...,Answer
Examples:
What is the smallest state in the USA?, MA;TX;RI;ME, RI
What force keeps planets in orbit around the sun?, Gravity;Magnetism;Friction;Inertia, Gravity

#### Example
```text
Create 20 quizes about everyday science. Each question should follow this comma-delimited format. Question number is not necessary:
Format:
Question,Selection1;Selection2;Selection3;...,Answer
Examples:
What is the smallest state in the USA?, MA;TX;RI;ME, RI
What force keeps planets in orbit around the sun?, Gravity;Magnetism;Friction;Inertia, Gravity
```
### Response from Bing
```text
What is the most common gas in the Earth's atmosphere?, Oxygen;Carbon dioxide;Nitrogen;Hydrogen, Nitrogen
What force keeps planets in orbit around the sun?, Gravity;Magnetism;Friction;Inertia, Gravity
What is the boiling point of water at sea level?, 100°C;212°F;90°C;200°F, 100°C
Which vitamin is produced by the human body when exposed to sunlight?, Vitamin A;Vitamin B;Vitamin C;Vitamin D, Vitamin D
What is the hardest natural substance on Earth?, Diamond;Quartz;Topaz;Granite, Diamond
How many elements are in the periodic table?, 108;118;128;138, 118
What part of the plant conducts photosynthesis?, Root;Stem;Flower;Leaf, Leaf
What is the primary source of energy for the Earth's climate system?, The Sun;The Moon;Geothermal heat;Wind, The Sun
What is the chemical formula for table salt?, NaCl;KCl;LiCl;MgCl2, NaCl
What type of animal is a dolphin?, Fish;Mammal;Reptile;Amphibian, Mammal
```