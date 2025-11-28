# TextArea Block

## Overview

The TextArea block provides a multi-line text input field for longer student responses such as essays, explanations, and open-ended answers. This can be used as an input inside of CapaProblem too.

## Technical Usage

### Basic Syntax
```xml
<TextArea id="essay" placeholder="Write your response here..." />
```

### Properties
- `id` (recommended): Unique identifier for the input
- `placeholder` (optional): Hint text displayed when empty
- `rows` (optional): Number of visible text rows

### State Fields
- `value`: The current text content entered by the student

### getValue
Returns the text string entered by the student.

## Pedagogical Purpose

TextArea supports constructed response assessments:

1. **Deep Thinking**: Extended writing promotes deeper engagement
2. **Expression**: Students articulate understanding in their own words
3. **Flexibility**: Accommodates varied response lengths
4. **Formative Assessment**: Reveals student thinking processes

## Common Use Cases

### Essay Questions
```xml
<Markdown>Explain the significance of the Civil War.</Markdown>
<TextArea id="essay_response" rows="10" />
```

### Reflection Prompts
```xml
<Markdown>What did you learn from this activity?</Markdown>
<TextArea id="reflection" placeholder="Share your thoughts..." />
```

### Code Entry
```xml
<Markdown>Write a function to calculate factorial:</Markdown>
<TextArea id="code_input" rows="8" />
```

## Integration with Graders

TextArea works with LLM-based grading for open-ended responses:
```xml
<TextArea id="response" />
<LLMFeedback target="response" />
```

## Example File
See `TextArea.olx` for working examples.
