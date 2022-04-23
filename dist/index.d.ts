/**
 * run a callback when the user presses some key or key combination.
 * your callback eventually gets passed down to
 * `document.addEventListener('keydown', listener)`.
 *
 * @example
 * ```ts
 * useKeyBind(['Cmd + Z', 'Ctrl + Z'], (e: KeyboardEvent) => {
 *   const state = getThePreviousStateFromSomewhere()
 *   setState(state)
 * }, [])
 * ```
 *
 * @returns
 * if it fails to parse any of the `keyString`s, this returns `false`.
 * otherwise it returns `true`.
 */
declare const useKeyBind: (keyStrings: string[], cb: (e: KeyboardEvent) => unknown, dependencies: unknown[]) => boolean;
/**
 * same as `useKeyBind` but attaches your callback to the `'keyup'` event.
 */
declare const useKeyUp: (keyStrings: string[], cb: (e: KeyboardEvent) => unknown, dependencies: unknown[]) => boolean;
export default useKeyBind;
export { useKeyBind, useKeyUp };
