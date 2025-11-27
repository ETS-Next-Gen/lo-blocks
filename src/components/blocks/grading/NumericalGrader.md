# NumericalGrader Block

## Overview

NumericalGrader grades numeric responses by comparing student input to an expected value, with configurable tolerance for rounding and precision. It supports complex numbers, ranges, and both absolute and percentage tolerances.

## Technical Usage

### Basic Syntax

Inside CapaProblem, the grader wraps its input:

```xml
<CapaProblem id="math_problem">
  <NumericalGrader answer="42">
    <p>What is 6 × 7?</p>
    <ComplexInput />
  </NumericalGrader>
</CapaProblem>
```

### Properties

- `answer` (required): The correct numerical answer (supports complex numbers like `3+4i`)
- `tolerance` (optional): Acceptable deviation - absolute number or percentage (e.g., `0.1` or `5%`)

### Compatible Inputs

NumericalGrader works with any input that provides a numeric value (e.g., NumberInput, ComplexInput).

### Tolerance Examples

```xml
<!-- Exact match -->
<NumericalGrader answer="100">

<!-- Absolute tolerance: accepts 99-101 -->
<NumericalGrader answer="100" tolerance="1">

<!-- Percentage tolerance: accepts 95-105 (within 5%) -->
<NumericalGrader answer="100" tolerance="5%">
```

### Range Answers

Answers can specify a range using interval notation:

```xml
<!-- Accept any value from 10 to 20 (inclusive) -->
<NumericalGrader answer="[10, 20]">

<!-- Accept any value from 10 (exclusive) to 20 (inclusive) -->
<NumericalGrader answer="(10, 20]">
```

### State Fields

- `correct`: Correctness status (CORRECT, INCORRECT, INVALID)
- `message`: Feedback message

## Related Blocks

- **ComplexInput**: Text input for numerical/complex values
- **RatioGrader**: For ratio/fraction answers with multiple inputs
- **CapaProblem**: Container that provides grading UI

## Example File

See `NumericalGrader.olx` for working examples.
