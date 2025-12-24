# RatioGrader

Grades ratio/fraction answers by comparing two numeric inputs. Accepts any equivalent ratio.

## Usage

Works with any two inputs that output numbers:

```olx:code
<CapaProblem id="effect_size">
  <RatioGrader answer="2.0">
    <Markdown>In Hake's study, interactive engagement produced roughly how many times the learning gain of traditional lecture?</Markdown>
    <Markdown>Ratio (IE gain : Traditional gain):</Markdown>
    <NumberInput /> : <NumberInput />
  </RatioGrader>
</CapaProblem>
```

## Properties

- `answer` (required): Expected ratio as decimal (first ÷ second)
- `tolerance` (optional): Acceptable deviation (absolute or `%`)

## How It Works

RatioGrader divides the first input by the second:

- `answer="2.0"` (ratio 2:1)
- Inputs 48, 24 → 48÷24 = 2.0 ✓
- Inputs 0.48, 0.24 → 2.0 ✓
- Inputs 50, 23 → 2.17 (may need tolerance)

## Compatible Inputs

Any inputs returning numbers: `NumberInput`, `ComplexInput`, etc.

