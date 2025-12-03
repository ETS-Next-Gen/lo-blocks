# MasteryBank

A mastery-based practice block that presents problems from a bank until the student achieves a streak of correct answers.

## Usage

### Inline ID List

```xml
<MasteryBank id="operant_quiz" goal="6">
  operant_001_positive_reinforcement
  operant_002_negative_reinforcement
  operant_003_negative_punishment
</MasteryBank>
```

### External ID List

```xml
<MasteryBank id="operant_quiz" goal="6" src="problem_ids.txt" />
```

### With Problems Defined Elsewhere

```xml
<!-- Problems defined in another file -->
<Vertical id="problem_bank">
  <CapaProblem id="q1">...</CapaProblem>
  <CapaProblem id="q2">...</CapaProblem>
  <CapaProblem id="q3">...</CapaProblem>
</Vertical>

<!-- MasteryBank references them by ID -->
<MasteryBank id="quiz" goal="5">
  q1, q2, q3
</MasteryBank>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | string | required | Unique identifier for this bank |
| `goal` | number | 6 | Number of correct answers in a row needed for mastery |
| `src` | string | - | Path to external file containing problem IDs |

## ID List Format

Problem IDs can be separated by:
- Commas: `id1, id2, id3`
- Spaces: `id1 id2 id3`
- Newlines (one per line)
- Any combination

IDs should not contain commas, spaces, or newlines.

## Behavior

1. Problems are presented in random order
2. On correct answer: streak increments, next problem shown
3. On incorrect answer: streak resets to 0, next problem shown
4. When streak reaches goal: mastery achieved, completion message shown
5. If all problems exhausted before mastery: list reshuffles and continues

## State

The block tracks:
- `currentIndex` - Position in the shuffled problem order
- `correctStreak` - Current consecutive correct answers
- `shuffledOrder` - Randomized order of problem indices
- `completed` - Whether mastery has been achieved
