# Course Block

## Overview

The Course block provides a hierarchical course structure with chapter-based navigation. It displays an accordion navigation sidebar on the left and selected content on the right. This is modeled after the original Open edX user interface, and designed to facilitate easy import of Open edX courses.

## Technical Usage

### Basic Syntax
```xml
<Course title="Introduction to Programming">
  <Chapter title="Getting Started" id="ch1">
    <Sequential>...</Sequential>
    <Vertical>...</Vertical>
  </Chapter>
  <Chapter title="Variables" id="ch2">
    <Markdown>Content here</Markdown>
  </Chapter>
</Course>
```

### Properties
- `id` (optional): Unique identifier
- `title` (required): Course title displayed in header

### Chapter Structure
Each `<Chapter>` element requires:
- `id` (required): Unique identifier for the chapter
- `title` (required): Display title in navigation
- Child blocks: Content to display when chapter is selected

### State Fields
- `selectedChild`: Currently displayed content item
- `expandedChapter`: Currently expanded chapter in navigation

## Pedagogical Purpose

The course structure is designed to provide a default linear pathway, while still supporting freeform navigation. Students should see:

1. **Clear Organization**: Chapters break content into manageable sections
2. **Navigation**: Learners can easily find and revisit content
3. **Progress Awareness**: Visible structure shows learning journey
4. **Modular Design**: Authors can organize content logically

Open edX courses were designed to allow students to self-navigate -- advanced students could skip ahead and only to problems on sections which are review, while students with gaps could use many aids, and revisit content.

## Common Use Cases

### Multi-Unit Course
```xml
<Course title="Biology 101">
  <Chapter title="Unit 1: Cells" id="unit1">
    <Sequential>...</Sequential>
  </Chapter>
  <Chapter title="Unit 2: Genetics" id="unit2">
    <Sequential>...</Sequential>
  </Chapter>
</Course>
```

### Tutorial Series
```xml
<Course title="Python Tutorial">
  <Chapter title="Basics" id="basics">
    <Vertical>...</Vertical>
  </Chapter>
  <Chapter title="Functions" id="functions">
    <Vertical>...</Vertical>
  </Chapter>
</Course>
```

## Related Blocks
- **Sequential**: Step-by-step progression within chapters
- **Vertical**: Simple vertical layout for content

## Example File
See `Course.olx` for working examples.
