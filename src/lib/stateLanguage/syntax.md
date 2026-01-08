# State Language Syntax

This document defines the syntax for the state language expression system.
Lines starting with `>>>` are test cases. The following lines (until blank or next `>>>`)
are the expected AST output.

## Sigil References

We use the `@` sigil as shorthand for component state (Redux runtime values):

>>> @essay
{ "type": "SigilRef", "sigil": "@", "id": "essay", "fields": [] }

>>> @quiz.done
{ "type": "SigilRef", "sigil": "@", "id": "quiz", "fields": ["done"] }

>>> @quiz.answer.text
{ "type": "SigilRef", "sigil": "@", "id": "quiz", "fields": ["answer", "text"] }

The `#` sigil references static OLX content:

>>> #assignment
{ "type": "SigilRef", "sigil": "#", "id": "assignment", "fields": [] }

The `$` sigil references global/RCT variables:

>>> $condition
{ "type": "SigilRef", "sigil": "$", "id": "condition", "fields": [] }

## Comparison Operators

Standard comparison operators return BinaryOp nodes:

>>> @x > 5
{ "type": "BinaryOp", "op": ">", "left": { "type": "SigilRef", "sigil": "@", "id": "x", "fields": [] }, "right": { "type": "Number", "value": 5 } }

>>> @x === "DONE"
{ "type": "BinaryOp", "op": "===", "left": { "type": "SigilRef", "sigil": "@", "id": "x", "fields": [] }, "right": { "type": "String", "value": "DONE" } }

Other comparison operators (these just need to parse, AST structure is similar):

>>> @x !== "value"
>>> @x < 5
>>> @x >= 5
>>> @x <= 5
>>> @count >= 100
>>> @score <= 0.8

## Boolean Operators

Logical AND and OR:

>>> @a && @b
{ "type": "BinaryOp", "op": "&&", "left": { "type": "SigilRef", "sigil": "@", "id": "a", "fields": [] }, "right": { "type": "SigilRef", "sigil": "@", "id": "b", "fields": [] } }

>>> @a || @b
{ "type": "BinaryOp", "op": "||", "left": { "type": "SigilRef", "sigil": "@", "id": "a", "fields": [] }, "right": { "type": "SigilRef", "sigil": "@", "id": "b", "fields": [] } }

Logical NOT:

>>> !@x
{ "type": "UnaryOp", "op": "!", "argument": { "type": "SigilRef", "sigil": "@", "id": "x", "fields": [] } }

Parentheses for grouping (parse only):

>>> (@a || @b) && @c
>>> !(@a && @b)

## Ternary Operator

Conditional expressions:

>>> @cond ? @a : @b
{ "type": "Ternary", "condition": { "type": "SigilRef", "sigil": "@", "id": "cond", "fields": [] }, "then": { "type": "SigilRef", "sigil": "@", "id": "a", "fields": [] }, "else": { "type": "SigilRef", "sigil": "@", "id": "b", "fields": [] } }

More complex ternary (parse only):

>>> $condition === "treatment" ? @treatment.value : @control.value
>>> @score > 0.8 ? "pass" : "fail"

## Arithmetic

Basic arithmetic operators:

>>> @x + 1
{ "type": "BinaryOp", "op": "+", "left": { "type": "SigilRef", "sigil": "@", "id": "x", "fields": [] }, "right": { "type": "Number", "value": 1 } }

Other arithmetic (parse only):

>>> 1 + @x
>>> @x + @y
>>> @x - @y
>>> @x * @y
>>> @x / @y
>>> @correct / @total * 100

## Function Calls

Function calls produce Call nodes:

>>> wordcount(@essay.value)
{ "type": "Call", "callee": "wordcount", "arguments": [{ "type": "SigilRef", "sigil": "@", "id": "essay", "fields": ["value"] }] }

Math functions use MemberAccess for the callee:

>>> Math.round(@x)
{ "type": "Call", "callee": { "type": "MemberAccess", "object": { "type": "Identifier", "name": "Math" }, "property": "round" }, "arguments": [{ "type": "SigilRef", "sigil": "@", "id": "x", "fields": [] }] }

More function calls (parse only):

>>> wordcount(@essay.value) >= 100
>>> Math.round(@correct / @total * 100)
>>> Math.floor(@score * 10)
>>> Math.ceil(@progress)
>>> Math.min(@a, @b)
>>> Math.max(@a, @b)

## Array/Children Aggregation

Member access on children:

>>> children.length
{ "type": "MemberAccess", "object": { "type": "Identifier", "name": "children" }, "property": "length" }

Array methods with arrow functions:

>>> children.every(c => c.done === "DONE")
{ "type": "Call", "callee": { "type": "MemberAccess", "object": { "type": "Identifier", "name": "children" }, "property": "every" }, "arguments": [{ "type": "ArrowFunction", "param": "c", "body": { "type": "BinaryOp", "op": "===", "left": { "type": "MemberAccess", "object": "c", "property": "done" }, "right": { "type": "String", "value": "DONE" } } }] }

More aggregation patterns (parse only):

>>> children.some(c => c.correct === "correct")
>>> children.filter(c => c.correct === "correct").length
>>> children.filter(c => c.correct === "correct").length >= 3
>>> children.map(c => c.value)
>>> children.map(c => c.value).join(", ")
>>> !children.some(c => c.correct === "incorrect")
>>> children.filter(c => c.id === @selected)
>>> children.find(c => c.id === @current).value

## String Literals

Strings produce String nodes:

>>> "DONE"
{ "type": "String", "value": "DONE" }

>>> 'correct'
{ "type": "String", "value": "correct" }

Sigils inside strings are NOT expanded:

>>> "@notexpanded"
{ "type": "String", "value": "@notexpanded" }

## Template Literals

Template literals with expressions:

>>> `prefix ${@x} suffix`
{ "type": "TemplateLiteral", "parts": [{ "type": "TemplateText", "value": "prefix " }, { "type": "TemplateExpr", "expression": { "type": "SigilRef", "sigil": "@", "id": "x", "fields": [] } }, { "type": "TemplateText", "value": " suffix" }] }

>>> `Score: ${@correct}/${@total}`

## Real-World Examples

These are realistic expressions that should all parse:

>>> @quiz.correct === "correct" || @quiz.attemptsRemaining === 0
>>> @intro.done === "DONE" && @quiz.done === "DONE"
>>> (@quiz1.correct === "correct" || @quiz1.done === "CLOSED") && @essay.done === "DONE"
>>> wordcount(@essay.value) > 25
>>> $condition === "treatment" ? @treatment.value : @control.value
>>> Math.round(@correct / @total * 100)
>>> children.filter(c => c.correct === "correct").length
>>> children.every(c => c.done === "DONE")

## Edge Cases

Simple identifiers:

>>> @id
{ "type": "SigilRef", "sigil": "@", "id": "id", "fields": [] }

>>> @_private
{ "type": "SigilRef", "sigil": "@", "id": "_private", "fields": [] }

>>> @quiz1
{ "type": "SigilRef", "sigil": "@", "id": "quiz1", "fields": [] }

Mixed sigils in one expression:

>>> @user + #greeting + $locale

Repeated references:

>>> @x + @x

## Numbers

>>> 42
{ "type": "Number", "value": 42 }

>>> 3.14
{ "type": "Number", "value": 3.14 }

>>> 0.5
{ "type": "Number", "value": 0.5 }
