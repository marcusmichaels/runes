# Roadmap — JavaScript Operators, Visually

A goal-ordered list of 50 operators to build interactive, visual explainers for. Each entry has a short hook describing what the visualisation should *show*, not just *say*.

**Status key:** `[ ]` todo · `[~]` in progress · `[x]` done

---

## 1. Arithmetic (10)

- [x] 01. `+` Addition — a number line with two vectors sliding and combining. Edge case: `+` with strings (concatenation) shown as typed dominoes joining.
- [ ] 02. `-` Subtraction — inverse of addition on the number line; show the direction matters (`5 - 2` vs `2 - 5`).
- [ ] 03. `*` Multiplication — area grid (`3 × 4` as rows × columns of tiles). Visually motivates why it's repeated addition.
- [ ] 04. `/` Division — `a` dots split into `b` equal stacks; show `a / b` as stack height and the remainder disappearing (sets up modulo).
- [x] 05. `%` Modulo — dots packed into groups of `b`; leftover = remainder. Plus a cycle/clock and `arr[i % arr.length]`.
- [ ] 06. `**` Exponentiation — nested boxes (`2 ** 3` = box inside box inside box) or a doubling tree.
- [ ] 07. `++` Increment (prefix vs postfix) — a counter with two observers, one reading before, one after, showing the order-of-ops difference.
- [ ] 08. `--` Decrement — mirror of `++`; reuse the prefix/postfix visual.
- [ ] 09. Unary `+` — a "type coerce to number" funnel: drop in a string/bool/null, a number drops out.
- [ ] 10. Unary `-` — number line mirror; hammer-to-the-left flip.

## 2. Assignment (7)

- [ ] 11. `=` Assignment — labelled variable box; value is poured in, old value evaporates. Contrast with reference vs value types.
- [ ] 12. `+=` `-=` `*=` `/=` `%=` — the "do-then-store" pattern shown as a two-step animation: compute outside, store back.
- [ ] 13. `**=` Exponent-assign — same "do-then-store" but with the nested-box motif from `**`.
- [ ] 14. Destructuring `=` (array) — items popping out of an array into named slots side by side.
- [ ] 15. Destructuring `=` (object) — object as labelled drawers; keys pulled into variables with optional renames and defaults.
- [ ] 16. `&&=` Logical-AND assign — only assigns if the current value is truthy; show conditional "lock" on the store.
- [ ] 17. `||=` / `??=` Logical-OR / nullish-assign — assigns only on falsy / nullish; the gate opens or stays shut depending on current value.

## 3. Comparison (6)

- [ ] 18. `==` Loose equality — the coercion table as a maze: two inputs, the coercion steps visible, the result at the end.
- [ ] 19. `===` Strict equality — "same type, same value" gate; mismatched-type pairs bounce off.
- [ ] 20. `!=` / `!==` — inverse gate visual; reuse the `==` / `===` maze.
- [ ] 21. `<` `<=` `>` `>=` — number line with two sliders; show string comparison (lexicographic) as dictionary scrubbing.
- [ ] 22. `Object.is` (companion) — comparison with `NaN`/`-0` distinctions; side-by-side with `===`.
- [ ] 23. `Array.prototype.includes` vs `===` (companion) — worth a visual aside since it's how `includes` is implemented.

## 4. Logical (5)

- [ ] 24. `&&` Logical AND — short-circuit shown as a chain of lights: first falsy snuffs the rest.
- [ ] 25. `||` Logical OR — first truthy lights up and the rest stay dark.
- [ ] 26. `!` Logical NOT — a switch; show `!!x` as the "cast to boolean" idiom.
- [ ] 27. `??` Nullish coalescing — a filter that only lets `null`/`undefined` through to the fallback; `0` and `''` pass the filter as-is.
- [ ] 28. `?:` Ternary — a Y-junction; condition picks the branch, result comes out.

## 5. Bitwise (8)

- [ ] 29. `&` Bitwise AND — two 8-bit rows stacked; each column lights only if both above are lit.
- [ ] 30. `|` Bitwise OR — same stack; column lights if either above is lit.
- [ ] 31. `^` Bitwise XOR — column lights only if exactly one above is lit.
- [ ] 32. `~` Bitwise NOT — a single 8-bit row flipping.
- [ ] 33. `<<` Left shift — bits walk left, zeros fill in; annotate with `n * 2**k`.
- [ ] 34. `>>` Signed right shift — bits walk right; sign bit fills from the left.
- [ ] 35. `>>>` Unsigned right shift — bits walk right; zeros fill from the left (sign ignored).
- [ ] 36. Flag-packing idiom (companion) — three toggles represented as bits in a byte; show `&` / `|` being used to read/set/unset.

## 6. Type, Membership, Reflection (6)

- [ ] 37. `typeof` — a conveyor belt: values in, type-string labels out. Call out the `typeof null === "object"` quirk.
- [ ] 38. `instanceof` — draw the prototype chain as vertebrae; walk up it, ticking off types.
- [ ] 39. `in` — an object pictured as labelled drawers; `"x" in obj` pulls the drawer open or bounces off.
- [ ] 40. `delete` — the drawer is removed, not just emptied. Show the difference vs `obj.x = undefined`.
- [ ] 41. `void` — a funnel that swallows anything and always outputs `undefined`.
- [ ] 42. `new` — a constructor stamping out copies; highlight `this` being the fresh instance.

## 7. Spread, Rest, Optional (4)

- [ ] 43. `...` Spread (array) — an array "unzipping" its items into a larger array or function call.
- [ ] 44. `...` Spread (object) — object drawers being copied side-by-side into a new cabinet; later keys overwrite earlier ones.
- [ ] 45. `...` Rest (function params) — fixed-position slots plus a "bucket" that collects the rest.
- [ ] 46. `?.` Optional chaining — a path walker on a broken bridge: a missing rung short-circuits to `undefined` instead of throwing.

## 8. String & Template (2)

- [ ] 47. `+` String concatenation — typed dominoes; include the "number + string" coercion gotcha.
- [ ] 48. Template literals `` ` ${} ` `` — a fill-in-the-blanks form where expressions evaluate in-place.

## 9. Control-flow adjacent (2)

- [ ] 49. `yield` / `yield*` — a generator as a paper-tape feeder; each `next()` advances one tear.
- [ ] 50. `await` — a promise depicted as a sealed envelope; `await` unseals it and resumes once the value is inside.

---

## Suggested build order

A good learning arc: **05 (done) → 01–04 → 11–13 → 18–20 → 24–27 → 29–36 → 37–42 → 43–46 → 49–50.** That gets you basics, arithmetic, comparison/logic, the surprisingly-rich bitwise family, then reflection, spread, and async. Keeps each "chapter" cohesive.

## Out-of-scope (for now)

- `=>` arrow functions — syntactic, not an operator proper.
- `async` — keyword, not an operator.
- Generator-function `*` declaration — syntactic.
- `yield*`, if it feels redundant after `yield`, can be folded into the `yield` page rather than its own.
