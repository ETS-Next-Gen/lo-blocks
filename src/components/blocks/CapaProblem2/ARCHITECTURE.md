# CapaProblem2 Architecture Analysis & Design

## Executive Summary

This document analyzes the lo-blocks architecture to inform CapaProblem2 design decisions. Key findings:

1. **ID conflicts are handled through sophisticated resolution contexts** - we don't need placeholder IDs
2. **State flows through declarative field-based system** - Show Answer can extend existing patterns
3. **Parse/render split enables both performance and flexibility** - we should preserve this
4. **Existing patterns provide clear path for improvements** - incremental enhancement vs rewrite

## Current Architecture Analysis

### 1. ID Generation and Management System

#### Multi-Context ID Resolution

The system uses `src/lib/blocks/idResolver.js` with different ID types for different purposes:

```javascript
const ID_RESOLUTION_MATRIX = {
  reduxId:      ["stateId", "id", "urlName", "url_name"],     // State storage key
  nodeId:       "nodeId.sentinel",                           // OLX tree reference
  htmlId:       ["id", "urlName", "url_name", "key"],        // DOM element ID
  reactKey:     ["key", "id", "urlName", "url_name"],        // React reconciliation
  displayName:  ["displayName", "display_name", "name", "id"] // Human-readable
};
```

**Key Insight**: IDs are context-sensitive with fallback chains. No need for placeholder IDs.

#### Parse vs Render ID Handling

**Parse Time** (`CapaProblem.js`):
- Auto-generates IDs when missing: `${id}_input_${inputIndex++}`
- Establishes static relationships via `targets` attributes
- Stores results in idMap for quick access

**Render Time** (`render.jsx`):
- Resolves IDs through context-appropriate functions
- Creates dynamic nodeInfo hierarchy
- Handles ID prefixes for list contexts

**Recommendation**: Keep existing ID generation at parse time, but clean up the logic.

### 2. State Management and Routing

#### Field-Based State System

Components declare state declaratively:
```javascript
export const fields = state.fields(['value', 'attempts', 'feedback', 'showAnswer']);
```

Access via selectors with automatic Redux integration:
```javascript
const value = useFieldSelector(props, fields.value, { fallback: '' });
const [showAnswer, setShowAnswer] = useReduxState(props, fields.showAnswer, false);
```

#### Input→Grader Flow Pattern

1. **Discovery**: Graders find inputs via `inferRelatedNodes()`:
   ```javascript
   const inputIds = inferRelatedNodes(props, {
     selector: n => n.blueprint?.getValue,
     infer: true,
     targets: props.targets
   });
   ```

2. **Value Collection**: Via component `getValue()` methods:
   ```javascript
   const values = inputIds.map(id => blueprint.getValue(props, state, id));
   ```

3. **State Updates**: Through learning analytics and Redux:
   ```javascript
   lo_event.logEvent('UPDATE_CORRECT', { id, correct, message, answers });
   ```

**Key Insight**: Grader-input relationships use runtime inference, not just parse-time mapping.

### 3. Show Answer Current Implementation

#### TextHighlight Pattern

Shows how Show Answer integrates with existing field system:
```javascript
const fields = state.fields(['value', 'showAnswer', 'checked']);

// In component:
const showAnswer = useFieldSelector(props, fields.showAnswer, { fallback: false });

if (showAnswer) {
  // Show correct answers with visual indicators
  if (word.isRequired) backgroundColor = '#c3f0c3';
  // Keep student answers visible with different styling
  if (isSelected) borderColor = '#9e9e9e';
}
```

**Key Insight**: Show Answer is a state field that modifies rendering, not replacement rendering.

#### Missing Pieces for CapaProblem2

- No standardized Show Answer interface across input types
- No coordination system for multi-input problems
- Need UI patterns for answer overlay vs replacement

### 4. Parse vs Render Time Logic Split

#### Parse Time Responsibilities
- Structure extraction from XML/OLX
- ID generation for components without explicit IDs
- Static relationship establishment (grader targets)
- Validation of basic structure

```javascript
// Current CapaProblem parser
if (blueprint?.getValue && currentGrader) {
  currentGrader.inputs.push(blockId);  // Static relationship
}
```

#### Render Time Responsibilities
- Dynamic DOM tree creation (`renderCompiledKids`)
- Runtime relationship inference
- State-dependent rendering decisions
- Chrome generation (buttons, status indicators)

```javascript
// Current CapaProblem renderer
const content = renderCompiledKids({ ...props, kids });
const graderIds = inferRelatedNodes(props, { selector: n => n.blueprint?.isGrader });
```

**Key Insight**: This split works well and should be preserved in CapaProblem2.

### 5. Open edX OLX Compatibility Analysis

#### Current Support Level

**Supported**:
- Basic problem structure (inputs + graders)
- Choice questions (Key/Distractor)
- Numerical grading with tolerance
- Target-based relationships

**Missing**:
- Show Answer functionality
- Response metadata (attempts, weight)
- Advanced problem types
- Rich feedback mechanisms

#### OLX Mapping Example

Current lo-blocks OLX:
```xml
<CapaProblem id="demo">
  <NumericalGrader answer="100" tolerance="5">
    <p>What is 10 × 10?</p>
    <NumberInput/>
  </NumericalGrader>
</CapaProblem>
```

Equivalent Open edX:
```xml
<problem>
  <p>What is 10 × 10?</p>
  <numericalresponse answer="100">
    <responseparam type="tolerance" default="5"/>
    <textline/>
  </numericalresponse>
</problem>
```

**Key Insight**: Structure is similar but semantics differ. We can bridge this gap.

## CapaProblem2 Design Decisions

Based on this analysis, here's the recommended approach for CapaProblem2:

### 1. Preserve Parse/Render Split

**Clean OLX Parser**:
- Fix the messy logic in current CapaProblem parser
- Keep ID generation at parse time (it works)
- Better validation and error messages
- Remove the TODO comments about being "minimal working version"

**Enhanced Dynamic Renderer**:
- Cleaner chrome generation (buttons, status)
- Better state-driven UI updates
- Support for Show Answer mode
- Runtime styling based on correctness state

### 2. Extend Field System for Show Answer

Add Show Answer support through existing field patterns:

```javascript
// Extended fields for CapaProblem2
export const fields = state.fields([
  'showAnswer',     // Problem-level show answer state
  'attemptsUsed',   // Attempt tracking
  'attemptsMax',    // Attempt limiting
  'hints'           // Progressive hints
]);
```

**Input Extension Pattern**:
```javascript
// Standard interface all inputs should support
const correctAnswer = useCorrectAnswer(props, id);  // From grader
const showAnswer = useShowAnswer(props, id);        // From problem context

// Rendering logic
return showAnswer ?
  <AnswerOverlay answer={correctAnswer} studentValue={value} /> :
  <NormalInput value={value} onChange={setValue} />;
```

### 3. Headless Testing Strategy

Leverage the existing functional/reactive architecture:

```javascript
// Test via getValue/setValue without DOM
const problem = await loadProblem('demo.xml');
await problem.setInputValue('input_1', '42');
await problem.submit();

expect(problem.getCorrectness()).toBe('correct');
expect(problem.getButtonText()).toBe('Check 1/3');
```

This works because:
- All logic flows through Redux state
- getValue provides complete component state
- No need for heavy mocking infrastructure

### 4. Markdown Support Via PEG→OLX

Following SimpleSortable pattern:

```javascript
// MarkdownCapaProblem component
const MarkdownCapaProblem = dev({
  ...peggyParser(markdownParser, {
    postprocess: ({ parsed, storeEntry, id }) => {
      // Generate OLX components from markdown
      const olxString = markdownToOLX(parsed);
      // Feed into existing CapaProblem2 parser
      return parseOLX(olxString, { storeEntry, id });
    }
  }),
  component: _Noop  // Generates other components
});
```

**Benefits**:
- Reuses all OLX logic and validation
- Maintains round-trip capability
- Keeps simple→complex authoring flow

## Implementation Plan

### Phase 1: Clean CapaProblem2 Parser ✓

- [x] Fix existing parser issues
- [x] Better validation and error handling
- [x] Remove "minimal working version" disclaimers
- [x] Document ID generation clearly

### Phase 2: Enhanced Renderer

- [ ] Extract chrome generation logic into clear functions
- [ ] State-driven UI updates (button text, colors, etc.)
- [ ] Better attempt tracking and limiting
- [ ] Cleaner CSS and styling system

### Phase 3: Show Answer System

- [ ] Extend input types with Show Answer interface
- [ ] Problem-level Show Answer coordination
- [ ] Answer overlay vs replacement UI patterns
- [ ] Integration with CapaButton

### Phase 4: Advanced Features

- [ ] Progressive hints system
- [ ] Real-time grading feedback
- [ ] Enhanced attempt limiting
- [ ] Better error messages and validation

### Phase 5: Markdown Support & Testing

- [ ] Markdown→OLX transformer via PEG
- [ ] Comprehensive headless test suite
- [ ] Performance optimization
- [ ] Documentation and examples

## Key Architecture Principles

1. **Work with the grain**: Extend existing patterns rather than fighting them
2. **Universal design**: Features should be useful beyond just CapaProblem2
3. **Incremental improvement**: Each phase should deliver value independently
4. **Preserve compatibility**: Don't break existing CapaProblem usage
5. **Leverage functional/reactive**: Use existing state flow for testing and introspection

## Conclusion

The lo-blocks architecture is more sophisticated than initially apparent. The ID resolution system, field-based state management, and parse/render split provide solid foundations for CapaProblem2.

The key insight is that we don't need a complete rewrite - we need targeted improvements that work with the existing architecture:

- **Clean up the parser** without changing the fundamental approach
- **Extend the field system** to support Show Answer and advanced features
- **Enhance the renderer** for better UX and dynamic behavior
- **Add Markdown support** via the proven PEG→OLX pattern

This approach minimizes risk while delivering the requested improvements: headless testing, Show Answer support, cleaner code, and better modularity.