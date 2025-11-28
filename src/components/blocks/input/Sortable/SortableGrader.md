# SortableGrader Block

## Overview

The SortableGrader block grades student arrangements in sortable exercises. It supports multiple grading algorithms for different assessment needs.

## Technical Usage

### Basic Syntax
```xml
<SortableInput id="order">
  <!-- items -->
</SortableInput>
<SortableGrader target="order" />
```

### Properties
- `id` (optional): Unique identifier
- `target` (optional): ID of SortableInput to grade (auto-inferred if not specified)
- `algorithm` (optional): Grading algorithm to use

### State Fields
- `correct`: Correctness status
- `message`: Feedback message

### Grading Algorithms
- **exact**: Full credit only for perfect order
- **partial**: Partial credit for partially correct sequences
- **adjacent**: Credit for correctly adjacent pairs
- **spearman**: Credit based on rank correlation

## Common Use Cases

### Strict Ordering (exact)
```xml
<SortableGrader target="recipe_steps" algorithm="exact" />
```
Use when exact sequence is critical (recipes, procedures).

### Partial Credit (partial)
```xml
<SortableGrader target="timeline" algorithm="partial" />
```
Use for long sequences where some errors are minor.

### Relative Positioning (adjacent)
```xml
<SortableGrader target="ranking" algorithm="adjacent" />
```
Use when relative order matters but exact position doesn't.

## Related Blocks
- **SortableInput**: Input component being graded
- **SimpleSortable**: Simplified sortable problem syntax
- **StatusText**: Displays grading feedback

## Example File
See `Sortable.md` for algorithm details and examples.
