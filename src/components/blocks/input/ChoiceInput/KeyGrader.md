# KeyGrader

Grades multiple choice by checking if a `Key` (correct) or `Distractor` (incorrect) was selected.

## Usage

```xml
<CapaProblem id="mc">
  <KeyGrader>
    <p>What is the capital of France?</p>
    <ChoiceInput>
      <Key>Paris</Key>
      <Distractor>London</Distractor>
      <Distractor>Berlin</Distractor>
    </ChoiceInput>
  </KeyGrader>
</CapaProblem>
```

## How It Works

1. Gets selected option from `ChoiceInput`
2. Checks if it's a `Key` or `Distractor`
3. Returns CORRECT or INCORRECT

## Related Blocks

- `ChoiceInput` - collects the selection
- `Key` - marks correct answer(s)
- `Distractor` - marks wrong answers
