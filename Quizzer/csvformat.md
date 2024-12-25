# Irus8Dev Quizzer 
Quickly create Quizzes to help with the following:
- Exam Preparations
- Fun
- Learning
# Usage:
You have 2 choices:
1. Load your own .csv (see .csv format)
2. Select from the examples

![alt](https://Quizzer/resource/mainpage.png)

# .csv format
```
Question, Answer1; Answer2; Answer3, Correct Answer
```
All text items will be trimmed and quotes will be removed.
## Escape characters
- Comma (,) = &c
- SemiColon (;) = &s
### Example
```text
North&c East&c West&c South -> North, East, West, South
```

## Q & A Example
```text
Is the earth flat?, Yes ; No, No
Who is the first president of Mars?, John Howard ; Suriyont Mujjalintrakool ; Elon Musk ; Donald Trump, Suriyont Mujjalintrakool
What is the smallest state in the USA?, MA ; TX ; RI ; ME, RI
```
## Q & A Example Output
```text
Is the earth flat?, Yes
Who is the first president of Mars?, Suriyont Mujjalintrakool
What is the smallest state in the USA?, RI
```

## Download Examples


- [Staying Healthy.csv](<https://Quizzer/resource/samples/Staying Healthy.csv>)

- [Fun Facts.csv](<https://Quizzer/resource/samples/Fun Facts.csv>)
