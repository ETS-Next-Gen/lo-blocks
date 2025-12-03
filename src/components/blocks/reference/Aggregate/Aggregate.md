# Aggregate

Aggregate is a renderless utility block that collects values from multiple target components. Use it to:

- Combine scores or subtotals across several graders/inputs (e.g., display `X / total` elsewhere with a Ref).
- Wait until a set of questions are completed or correct by inspecting the counts it produces.
- Pull together structured data from a graphic organizer by gathering values from its children.

## Attributes

- `target` (required): Comma or whitespace separated list of component IDs to aggregate.
- `field` (optional): Specific field name to pull from each target instead of calling its `getValue()`.

## Value shape

`getValue()` returns an object:

```json
{
  "ids": ["input1", "input2"],
  "entries": [
    { "id": "input1", "value": "..." },
    { "id": "input2", "value": "..." }
  ],
  "values": { "input1": "...", "input2": "..." },
  "counts": {
    "targets": 2,
    "resolved": 2,
    "truthy": 1
  },
  "numeric": {
    "sum": 5,
    "average": 2.5,
    "count": 2
  },
  "errors": []
}
```

- `ids`: Normalized list of unique targets.
- `entries`: Per-target results, including any errors.
- `values`: Map of successfully resolved target values.
- `counts`: Quick status for total, resolved, and truthy values (useful for completion gating).
- `numeric`: Sum/average/count for numeric-friendly values.
- `errors`: Any lookup or field resolution errors.

## Example

```xml
<Aggregate id="quiz_progress" target="q1, q2, q3" />
``` 

Then elsewhere:

```xml
<Ref target="quiz_progress" field="getValue" />
```