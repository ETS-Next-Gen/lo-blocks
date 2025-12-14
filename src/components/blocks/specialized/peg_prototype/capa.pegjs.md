# CAPA Problem Markdown Format

This documents the Open edX markdown format for CAPA (Computer Assisted Personalized Approach) problems and the subset currently supported by our grammar.

## Full Open edX Syntax

The Open edX simple editor uses markdown-style formatting for problem authoring. The format is based on [LON-CAPA XML](https://openedx.atlassian.net/wiki/spaces/AC/pages/128090267/Capa+Problem+Architecture) but adapted for edX.

### Headers

```
Problem Title
=============
```

Underline text with `===` to create a header (h3).

### Questions/Prompts

```
>>What is the capital of France?<<
```

Wrap the question label in `>>` and `<<` markers.

### Multiple Choice

```
( ) Wrong answer
(x) Correct answer
( ) Another wrong answer
```

- `( )` marks a distractor (wrong answer)
- `(x)` marks the correct answer

### Checkbox (Multiple Select)

```
[ ] Wrong option
[x] Correct option 1
[x] Correct option 2
[ ] Another wrong option
```

- `[ ]` marks an incorrect option
- `[x]` marks a correct option (multiple allowed)

### Text Input

```
>>What African-American led the U.S. civil rights movement during the 1960s?<<
=Dr. Martin Luther King, Jr.
or=Dr. Martin Luther King, Junior
or=Martin Luther King, Jr.
or=Martin Luther King
```

- `=answer` marks the primary correct answer
- `or=answer` adds alternative correct answers
- `not=answer {{feedback}}` provides feedback for specific wrong answers

With feedback:
```
=Correct Answer {{Great job!}}
not=Common Wrong Answer {{Close, but think about...}}
```

### Numerical Input

```
= 42
= 3.14 +- 0.01
= [1, 5]
```

- Exact value: `= 42`
- With tolerance: `= 3.14 +- 0.01`
- Range: `= [1, 5]`

### Dropdown

```
[[wrong, (correct), also wrong]]
```

Double brackets with comma-separated options. Parentheses mark the correct answer.

### Hints

```
||This is a hint that appears when requested.||
```

Wrap hint text in `||` markers.

### Demand Hints (Sequential)

```
{{
This is the first hint.
====
This is the second hint.
====
This is the third hint.
}}
```

### Explanation

```
[explanation]
This explanation appears after the learner clicks "Show Answer".
It can contain multiple paragraphs and formatting.
[/explanation]
```

### Multiple Questions (in one component)

```
>>First question?<<
(x) Answer A
( ) Answer B

---

>>Second question?<<
( ) Answer C
(x) Answer D
```

Separate questions with `---` (three hyphens).

### Inline Feedback

```
( ) Wrong {{ Feedback for this wrong answer }}
(x) Correct {{ Feedback for selecting correct answer }}
```

Feedback in `{{ }}` after each option.

### Scripts and Variables

```
[code]
import random
x = random.randint(1, 10)
y = random.randint(1, 10)
answer = x + y
[/code]

>>What is $x + $y?<<
= $answer
```

Python code blocks for randomization, with `$variable` substitution.

---

## Currently Supported Subset

Our `capa.pegjs` grammar currently supports a minimal subset for prototyping:

| Feature | Syntax | Supported |
|---------|--------|-----------|
| Headers | `Text` + newline + `===` | ✅ |
| Questions | `>>question<<` | ✅ |
| Multiple Choice | `(x)` / `( )` | ✅ |
| Hints | `\|\|hint\|\|` | ✅ |
| Paragraphs | Plain text | ✅ |
| Checkbox | `[x]` / `[ ]` | ❌ |
| Text Input | `= answer`, `or=`, `not=` | ❌ |
| Numerical Input | `= number` | ❌ |
| Dropdown | `[[options]]` | ❌ |
| Explanation | `[explanation]...[/explanation]` | ❌ |
| Multiple Questions | `---` separator | ❌ |
| Inline Feedback | `{{ feedback }}` | ❌ |
| Demand Hints | `{{ hint ==== hint }}` | ❌ |
| Scripts | `[code]...[/code]` | ❌ |
| Variable Substitution | `$variable` | ❌ |

### Example (Supported)

```
Newton's Laws
===

Consider a ball thrown straight up into the air.

>>At the highest point of its trajectory, what is the net force on the ball?<<

( ) Zero - the ball is momentarily at rest
(x) Downward - gravity acts continuously
( ) Upward - residual force from the throw
( ) Undefined - forces cancel out

||Think about what force is always acting on objects near Earth's surface.||
```

### AST Output

The parser produces a flat array of block objects:

```json
[
  { "type": "h3", "content": "Newton's Laws" },
  { "type": "p", "content": "Consider a ball thrown straight up into the air." },
  { "type": "question", "label": "At the highest point..." },
  { "type": "choices", "options": [
    { "selected": false, "text": "Zero - the ball is momentarily at rest" },
    { "selected": true, "text": "Downward - gravity acts continuously" },
    ...
  ]},
  { "type": "hint", "content": "Think about what force..." }
]
```

---

## References

- [CAPA Problem Architecture](https://openedx.atlassian.net/wiki/spaces/AC/pages/128090267/Capa+Problem+Architecture)
- [Working with Problem Components](https://edx.readthedocs.io/projects/open-edx-building-and-running-a-course/en/open-release-lilac.master/course_components/create_problem.html)
- [Upcoming Markdown and OLX Changes](https://openedx.org/course-staff/upcoming-markdown-and-olx-changes-capa-problems/)
- [Problem Components OLX Reference](https://github.com/openedx/edx-documentation/blob/master/en_us/olx/source/components/problem-components.rst)
- [Text Input Problems](https://edx.readthedocs.io/projects/open-edx-building-and-running-a-course/en/open-release-olive.master/exercises_tools/text_input.html)
