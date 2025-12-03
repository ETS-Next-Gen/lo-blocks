# ActionButton Block

## Overview

The ActionButton block provides a clickable button that triggers actions on its child components. When clicked, it automatically finds and executes all action blocks (graders, LLMActions, etc.) that are nested inside it.

## Technical Usage

### Basic Syntax
```xml
<ActionButton label="Check Answer">
  <NumericalGrader target="input" expected="42" />
</ActionButton>
```

### Properties
- `id` (optional): Unique identifier
- `label` (required): Button text to display
- `dependsOn` (optional): Prerequisite conditions before button is enabled

### State Fields
- `isDisabled`: Whether the button is currently disabled

### Action Discovery

ActionButton uses `inferRelatedNodes` to find actions to execute. By default, it searches:
- **Kids**: All descendant (child) nodes of the button
- **Parents**: All ancestor nodes (rarely used for actions)

**Important**: Actions must be **children** of ActionButton, not siblings:

```xml
<!-- CORRECT: Action is a child -->
<ActionButton label="Get Feedback">
  <LLMAction target="feedback">...</LLMAction>
</ActionButton>

<!-- WRONG: Action is a sibling - won't be found -->
<LLMAction target="feedback">...</LLMAction>
<ActionButton label="Get Feedback" />
```

## Pedagogical Purpose

ActionButton enables interactive assessment:

1. **Student Agency**: Students control when to submit
2. **Deliberate Action**: Prevents accidental submissions
3. **Multi-Action Coordination**: Triggers multiple graders/actions at once
4. **Visual Feedback**: Clear interaction point for students

## Common Use Cases

### Trigger Grading
```xml
<NumberInput id="answer" />
<ActionButton label="Check Answer">
  <NumericalGrader id="grader" target="answer" answer="42" />
</ActionButton>
<Correctness target="grader" />
```

Note: `Correctness` targets the **grader**, not the input. The grader stores the correctness state.

### Request LLM Feedback
```xml
<TextArea id="response" />
<LLMFeedback id="feedback" />
<ActionButton label="Get Feedback">
  <LLMAction target="feedback">
    Evaluate this student response:
    <Ref id="response_ref" target="response" />
  </LLMAction>
</ActionButton>
```

### Multiple Actions
```xml
<TextArea id="essay" />
<LLMFeedback id="grammar" />
<LLMFeedback id="style" />
<ActionButton label="Analyze">
  <LLMAction target="grammar">Check grammar: <Ref id="g_ref" target="essay" /></LLMAction>
  <LLMAction target="style">Analyze style: <Ref id="s_ref" target="essay" /></LLMAction>
</ActionButton>
```

### Conditional Enable
```xml
<TextArea id="essay" />
<ActionButton label="Submit" dependsOn="essay:filled">
  <LLMAction target="feedback">...</LLMAction>
</ActionButton>
```

## Related Blocks
- **NumericalGrader**: Grades numerical responses when triggered
- **KeyGrader**: Grades multiple choice when triggered
- **LLMAction**: Executes LLM prompts when triggered
- **LLMFeedback**: Displays LLM responses
- **CapaProblem**: Provides automatic Check button for graded problems

## Example File
See `ActionButton.olx` for working examples.
