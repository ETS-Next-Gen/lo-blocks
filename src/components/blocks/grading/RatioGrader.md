# RatioGrader Block

## Overview

RatioGrader grades ratio and fraction answers by comparing the proportional relationship between two inputs. It accepts any equivalent ratio, not just exact values.

## Technical Usage

### Basic Syntax

Inside CapaProblem, the grader wraps its inputs:

```xml
<CapaProblem id="ratio_problem">
  <RatioGrader answer="0.5" tolerance="0.01">
    <p>Express the ratio 1:2 using any equivalent numbers:</p>
    <ComplexInput />
    <ComplexInput />
  </RatioGrader>
</CapaProblem>
```

### Properties

- `answer` (required): The expected ratio as a decimal (first value ÷ second value)
- `tolerance` (optional): Acceptable deviation (absolute or percentage with `%`)

### Compatible Inputs

RatioGrader works with any inputs that provide numeric values (e.g., NumberInput, ComplexInput).

### How It Works

RatioGrader divides the first input by the second and compares to the expected ratio:

- Expected `answer="0.5"` (ratio 1:2)
- Input: 2 and 4 → 2÷4 = 0.5 → Correct
- Input: 3 and 6 → 3÷6 = 0.5 → Correct
- Input: 2 and 3 → 2÷3 = 0.667 → Incorrect

### State Fields

- `correct`: Correctness status (CORRECT, INCORRECT, INVALID)
- `message`: Feedback message

## Related Blocks

- **NumericalGrader**: For single numeric values
- **ComplexInput** / **NumberInput**: Input fields for the ratio values
- **CapaProblem**: Container that provides grading UI

## Example File

See `RatioGrader.olx` for working examples.
