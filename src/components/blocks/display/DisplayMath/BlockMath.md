# BlockMath Block

## Overview

The BlockMath block renders LaTeX mathematical equations as centered, block-level elements. It displays equations prominently, typically on their own line, suitable for important formulas and equations.

## Technical Usage

### Basic Syntax
```xml
<BlockMath id="quadratic">
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
</BlockMath>
```

### Shorthand Syntax (XML validation disabled only)
```xml
<$$>E = mc^2</$$>
```

**Note:** The shorthand `<$$>` syntax only works when XML validation is disabled, as `$$` is not a valid XML tag name. When validation is enabled (the default), use `<BlockMath>` instead.

### Properties
- `id` (optional): Unique identifier for the block

### LaTeX Support
BlockMath uses KaTeX for rendering and supports standard LaTeX math notation including:
- Fractions (`\frac{a}{b}`)
- Square roots (`\sqrt{x}`)
- Subscripts and superscripts (`x_i`, `x^2`)
- Greek letters (`\alpha`, `\beta`, `\gamma`)
- Matrices and arrays
- Summations and integrals (`\sum`, `\int`)
- Trigonometric functions (`\sin`, `\cos`, `\tan`)

## Pedagogical Purpose

Block math equations support STEM education by:

1. **Clarity**: Centered display makes equations prominent and readable
2. **Reference**: Important formulas stand out for future reference
3. **Professional Formatting**: Publication-quality equation rendering
4. **Accessibility**: Screen readers can access LaTeX source

## Common Use Cases

### Defining Key Equations
Display fundamental equations that learners should memorize or reference.

### Step-by-Step Solutions
Show each step of a mathematical derivation.

### Theorem Statements
Present mathematical theorems in formal notation.

## Related Blocks
- **InlineMath**: For equations within flowing text

## Example File
See `BlockMath.olx` for working examples.
