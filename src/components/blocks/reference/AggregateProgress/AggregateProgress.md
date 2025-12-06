# AggregateProgress

Aggregates correctness across multiple grader blocks and renders a compact progress indicator. It is a concrete example of using `useAggregate` in a reusable block so you can drop it into a problem and watch all of the referenced graders update in real time.

## Behavior

- Defaults to discovering grader blocks automatically (anything with `isGrader=true` in the same tree).
- Accepts explicit targets when you want to override inference.
- Counts fully correct, partially correct, graded, and remaining items and surfaces them in a simple summary row plus a native `<progress>` indicator.

## Attributes

- `label` (optional): Heading text for the indicator (defaults to `"Progress"`).
- `target` / `targets` (optional): Comma-separated list or JSON array of component IDs to aggregate. If omitted, graders are inferred from parents and children.
- `infer` (optional): Override inference direction. Uses the same semantics as `inferRelatedNodes` (`"parents"`, `"kids"`, `true`, `false`).

## Usage

Placed inside a problem alongside actual grader blocks (e.g., `NumericalGrader`), the block will find graders automatically:

```xml
<CapaProblem id="earth_science">
  <NumericalGrader id="mass" answer="5.97e24">
    <p>What is the mass of Earth (in kilograms)?</p>
    <NumberInput />
    <Correctness />
  </NumericalGrader>
  <NumericalGrader id="radius" answer="6371">
    <p>What is the Earth's mean radius (in kilometers)?</p>
    <NumberInput />
    <Correctness />
  </NumericalGrader>
  <AggregateProgress id="earth_progress" label="Earth facts" />
</CapaProblem>
```

If you have graders elsewhere in the tree, pass explicit targets:

```xml
<AggregateProgress id="quiz_progress" targets="['g1','g2','g3']" label="Quiz progress" />
```

Whenever any referenced grader updates its `correct` field, the progress indicator re-renders with the new totals. The accompanying `Correctness` blocks make it clear that real graders are present and emitting correctness values for aggregation.