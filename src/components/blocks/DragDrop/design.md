Text match type:

Data format: https://docs.moodle.org/500/en/Drag_and_drop_into_text_question_type
https://userguide.taotesting.com/user-documentation/latest/public/gap-match-interaction
https://h5p.org/tutorial-drag-and-drop-question


Ordering:
https://docs.moodle.org/500/en/Ordering_question_type
(includes grading calculations)

Zones in image:
https://docs.moodle.org/500/en/Drag_and_drop_markers_question_type
(anywhere in area)
https://docs.moodle.org/500/en/Drag_and_drop_onto_image_question_type
(specific positions)



│ > Please read /docs/. I'm glad you're using redux, but this is outside the design of the platform. Otherwise: DragDropItem should be an Block. We can drag-and-drop    │
│   anything as we could in the Sortable. DropZone should be DropZoneById | DropZoneCircle | DropZoneRect | .... It should support, at the very least, nesting of        │
│   DropZoneCircle **within** some ID (e.g. "10,20-80,90 within imageMitochondrialPicture"), so we can be pixel-perfect aligned within images. You should also think     │
│   about snap (e.g. things dropped in a zone go to one location), 1:many (e.g. "Drop inner and outer planets into InnerZone and OuterZone"), student feedback,          │
│   resizeable zones (e.g. drop items into a table),                                                                                                                     │



Possible OLX Format with Child Block Support
============================================

  <DragDropInput
    backgroundImage="solar_system.png"
    mode="standard"
    maxAttempts="3"
    weight="10"
    showAnswer="finished"
  >
    <!-- Question/Instructions -->
    <Markdown>
      Drag each planet to its correct orbital region around the Sun.
    </Markdown>

    <!-- Draggable Items - Support ANY child blocks! -->
    <DragItem id="mercury" zones="inner" feedback="Mercury is the closest planet to the Sun!">
      <Image src="mercury.png" alt="Mercury" />
      <TextBlock>Mercury</TextBlock>
    </DragItem>

    <DragItem id="venus" zones="inner">
      <!-- Child blocks = maximum flexibility -->
      <Vertical>
        <Image src="venus.png" alt="Venus" />
        <Markdown>**Venus**
        The hottest planet</Markdown>
      </Vertical>
    </DragItem>

    <DragItem id="mars" zones="inner" color="#red">
      <!-- Simple text item -->
      <TextBlock>Mars - The Red Planet</TextBlock>
    </DragItem>

    <DragItem id="jupiter" zones="outer" reusable="true">
      <!-- Reusable items for multiple placements -->
      <Image src="jupiter.png" />
    </DragItem>

    <!-- Decoy item - doesn't belong anywhere -->
    <DragItem id="asteroid" zones="" feedback="Asteroids aren't planets!">
      <TextBlock>Asteroid</TextBlock>
    </DragItem>

    <!-- Drop Zones -->
    <DropZone
      id="inner"
      x="100" y="150" w="200" h="100"
      title="Inner Planets"
      maxItems="3"
      outline="dashed"
    >
      <!-- Zone content/label -->
      <TextBlock>Rocky Planets</TextBlock>
    </DropZone>

    <DropZone
      id="outer"
      x="350" y="150" w="200" h="100"
      title="Outer Planets"
      accepts="jupiter,saturn,uranus,neptune"
      alignment="center"
    >
      <TextBlock>Gas Giants</TextBlock>
    </DropZone>

    <!-- Feedback -->
    <StartFeedback>
      <Markdown>Drag the celestial bodies to their correct regions!</Markdown>
    </StartFeedback>

    <CompleteFeedback>
      <Markdown>Great job! You've correctly organized the solar system.</Markdown>
    </CompleteFeedback>
  </DragDropInput>

  Key Design Decisions

  1. Child Block Support ✨

  <DragItem id="complex">
    <Vertical>
      <Image src="diagram.png" />
      <Markdown>**Label**: Description</Markdown>
      <MathJax>E = mc^2</MathJax>
    </Vertical>
  </DragItem>
  - Pedagogical Power: Images, formatted text, math, embedded videos
  - Implementation: Reuse existing render() system - "free" as you said!

  2. Semantic Attribute Mapping

  | edX v2 Field | Our OLX Attribute   | Example                        |
  |--------------|---------------------|--------------------------------|
  | zones        | zones="zone1,zone2" | Which zones accept this item   |
  | displayName  | Child blocks        | <TextBlock>Name</TextBlock>    |
  | feedback     | feedback="message"  | Item-specific feedback         |
  | imageURL     | <Image src="..."/>  | As child block (more flexible) |
  | can_reuse    | reusable="true"     | Allow multiple placements      |

  3. Zone Configuration

  <DropZone
    id="zone1"
    x="100" y="50" w="150" h="100"     <!-- Positioning -->
    title="Zone Title"                 <!-- Accessibility -->
    maxItems="2"                       <!-- Capacity limit -->
    accepts="item1,item2"              <!-- Explicit allow-list -->
    outline="solid|dashed|none"        <!-- Visual style -->
    alignment="left|center|right"      <!-- Item arrangement -->
  >
    <!-- Zone label as child blocks -->
    <TextBlock>Drop items here</TextBlock>
  </DropZone>

● Component Architecture

  Component Structure

  DragDropInput/
  ├── DragDropInput.js          # Block definition with parsers
  ├── _DragDropInput.jsx        # Main React component
  ├── _DragItem.jsx            # Individual draggable item
  ├── _DropZone.jsx           # Drop target zone
  └── DragDropGrader.js       # Grading logic

  Data Flow

  // State Management (similar to SortableInput)
  const [itemStates, setItemStates] = useReduxState(props, fields.itemStates, {});

  // Item State Structure
  itemStates = {
    "mercury": { x: 150, y: 200, zone: "inner", correct: true },
    "venus": { x: 180, y: 220, zone: "inner", correct: true },
    "jupiter": { x: null, y: null, zone: null, correct: null }, // Not placed
  }

  Drag & Drop Implementation

  - Reuse SortableInput patterns: Similar drag handlers, visual feedback
  - Add positioning logic: Convert mouse coords to zone detection
  - Zone validation: Check accepts attribute and maxItems
  - Feedback system: Per-item and completion messages

● Implementation Roadmap

  Phase 1: Core Infrastructure (Week 1)

  1. Basic component structure
  // DragDropInput.js - Block definition
  const DragDropInput = core({
    ...parsers.blocks(), // Child block support!
    name: 'DragDropInput',
    fields: state.fields(['itemStates'])
  });
  2. Static rendering - Image background, items, zones (no interaction yet)
  3. Parser setup - Extract DragItem and DropZone child elements

  Phase 2: Basic Drag & Drop (Week 2)

  1. Draggable items - Reuse SortableInput drag logic
  2. Zone detection - Hit testing based on x,y,w,h coordinates
  3. Visual feedback - Drag preview, zone highlights
  4. State management - Track item positions

  Phase 3: Validation & Feedback (Week 3)

  1. Grading logic - Check item → zone correctness
  2. Feedback system - Per-item messages, completion feedback
  3. Mode support - Standard (immediate) vs Assessment (submit all)
  4. Attempt limiting - maxAttempts handling

  Phase 4: Polish & Features (Week 4)

  1. Zone constraints - maxItems, accepts filtering
  2. Reusable items - Multiple placements
  3. Accessibility - Keyboard navigation, screen reader support
  4. Visual polish - Animations, zone outlines, alignment

  Complexity Assessment

  Moderate Difficulty (3-4 weeks) because we can reuse:
  - ✅ Drag & Drop Logic - From SortableInput
  - ✅ Child Block Rendering - From existing render() system
  - ✅ State Management - Redux patterns already established
  - ✅ Grading Integration - Action/grader system in place

  New Challenges:
  - 🟡 Coordinate System - Convert mouse to zone detection
  - 🟡 Zone Validation - accepts/maxItems logic
  - 🟡 Visual Layout - Absolute positioning over background image

  Educational Use Cases Enabled

  1. Science: Label parts of diagrams (anatomy, chemistry, physics)
  2. Geography: Place countries/capitals on maps
  3. History: Timeline events, cause-effect relationships
  4. Language: Grammar construction, vocabulary categorization
  5. Math: Sort numbers/equations into categories
  6. Art: Color theory, composition analysis

  Recommendation

  This design gives us 90% of edX v2's pedagogical power with clean, composable OLX that's actually
   more flexible than the original. The child block support means teachers can create drag items
  with:

  - Rich media: Images, videos, math formulas
  - Complex layouts: Multi-line text with formatting
  - Interactive elements: Nested components
  - Reusable content: Reference existing blocks with <Use>

  Should we start with Phase 1 - building the basic component structure and static rendering?
