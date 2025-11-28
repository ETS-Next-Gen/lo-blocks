# Spinner Block

## Overview

The Spinner block displays a loading/processing indicator. It's used to show users that an operation is in progress.

## Technical Usage

### Basic Syntax
```xml
<Spinner />
```

### Properties
- `id` (optional): Unique identifier

## Purpose

Spinner provides visual feedback during:

1. **Loading States**: Content being fetched
2. **Processing**: LLM calls or other async operations
3. **Transitions**: Between content states

## Usage Context

Spinner is typically used internally by other components:
- LLMFeedback shows Spinner while waiting for AI response
- Content loading displays Spinner during fetch
- Other transitions may show Spinner

## Direct Usage

While Spinner can be used directly, it's more common to see it as part of other components' internal rendering.

```xml
<!-- Rare: direct usage -->
<Spinner />
```

## Visual Design

The Spinner displays an animated loading indicator, styled to match the application's visual design.

## Related Blocks
- **LLMFeedback**: Uses Spinner during AI processing
- **Chat**: May show Spinner during content loading
