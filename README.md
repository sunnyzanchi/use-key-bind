# React hook for keybinds

## example

```js
import { useKeyBind } from '@zanchi/use-key-bind'

useKeyBind(
  ['Cmd + Z', 'Ctrl + Z'],
  (e) => {
    const state = getThePreviousStateFromSomewhere()
    setState(state)
  },
  []
)

useKeyBind(['Cmd + f'], doSomethingToShowFindFunctionality, [])
```

## `useKeyBind(keyStrings: string[], cb: (e: KeyboardEvent) => unknown, dependencies: unknown[]): boolean`

`useKeyBind` returns `false` if it couldn't
parse any of the provided `keyString`s.
otherwise returns `true`.

### `keyStrings: string[]`

`keyStrings` is an array of strings, with keys and modifiers delimited by `+`.
`cb` will be called if any of the `keyStrings` match the user's input.
modifiers are expected to come first, the non-modifier key should come last.
capitalization is ignored, so key binds will work whether the user technically
types `Cmd + z` or `Cmd + Z`.

supported modifiers are:

- `Alt`
- `Cmd`
- `Ctrl`
- `Shift`

```js
// these are valid `keyString`s
const keyStrings = ['4', 'Tab', 'shift + tab' 'Shift + Alt + g', 'cmd + Z', 'Ctrl + Z']

// these are invalid `keyString`s
const keyStrings = ['Ctrl + W + D', 'y + Ctrl', '1 + 2', 'Tab + Enter']
```

### `cb: (e: KeyboardEvent) => unknown`

`cb` is the function you want to run when
the user presses any of the specified keystrings.

### `dependencies: unknown[]`

internally, `useKeyBind` uses `useEffect`
to add and remove the `keydown` event listeners.
any outside variables used in `cb` should be in this array,
just how you'd do for a `useEffect`.

## contributing

submit a pr
