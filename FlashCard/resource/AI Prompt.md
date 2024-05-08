### Create Quiz based on Study Content (works with Gemini)

```text
Based on the study content below, Create quizzes. Each question should follow this comma-delimited format:
Format:
Question,Selection1;Selection2;Selection3;...,Answer
Example:
What is the smallest state in the USA?, MA;TX;RI;ME, RI
Study content:
Project Management Basics
-------------------------
Attributes/Definition of Projects:
Unique purpose
Temporary
Requires resources
Has a primary customer or sponsor
Involves uncertainty (time, resources, budget)

Project Management:
Application of knowledge, skills, tools, and techniques to project activities
Aims to meet project requirements and triple constraints (scope, time, cost)

Difference between project and program:
Project – a product or a service
Program –  a group of projects

What is Triple Constraint?:
Scope refers to the features and functionality of the project.
Time refers to the duration of the project.
Cost refers to the financial resources required to complete the project.

.....

```

### Create quize for all kinds of topics
```text
Create {{number of questions}} questionnaires about {{topic}}. Question number is not necessary.
Format:
Question,Selection1;Selection2;Selection3;...,Answer
Example:
What force keeps planets in orbit around the sun?, Gravity;Magnetism;Friction;Inertia, Gravity
```
#### Example

```text
Create 10 quizes about everyday science. Each question should follow this comma-delimited format:
Format:
Question,Selection1;Selection2;Selection3;...,Answer
Example:
What is the smallest state in the USA?, MA;TX;RI;ME, RI
```
#### Response from Bing
```text
1. What is the most common gas in the Earth's atmosphere?, Oxygen;Carbon dioxide;Nitrogen;Hydrogen, Nitrogen
2. What force keeps planets in orbit around the sun?, Gravity;Magnetism;Friction;Inertia, Gravity
3. What is the boiling point of water at sea level?, 100°C;212°F;90°C;200°F, 100°C
4. Which vitamin is produced by the human body when exposed to sunlight?, Vitamin A;Vitamin B;Vitamin C;Vitamin D, Vitamin D
5. What is the hardest natural substance on Earth?, Diamond;Quartz;Topaz;Granite, Diamond
6. How many elements are in the periodic table?, 108;118;128;138, 118
7. What part of the plant conducts photosynthesis?, Root;Stem;Flower;Leaf, Leaf
8. What is the primary source of energy for the Earth's climate system?, The Sun;The Moon;Geothermal heat;Wind, The Sun
9. What is the chemical formula for table salt?, NaCl;KCl;LiCl;MgCl2, NaCl
10. What type of animal is a dolphin?, Fish;Mammal;Reptile;Amphibian, Mammal
```