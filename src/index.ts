import { DependencyList, useEffect } from 'react'

/**
 * the modifier keys are named after their property name on KeyboardEvent.
 * `key` is a `string`. capitalization is ignored.
 */
type KeyConfig = KeyConfigModifiers & {
  key: KeyboardEvent['key']
}

type KeyConfigModifiers = {
  altKey: boolean
  ctrlKey: boolean
  /**
   * this is `Cmd` on Mac.
   */
  metaKey: boolean
  shiftKey: boolean
}

/**
 * get a string like `'Ctrl + Z'` and give back
 * a more convenient data structure for the keydown listener.
 */
const parseKeyString = (str: string): KeyConfig | null => {
  const keys = str.split('+').map((s) => s.trim())
  const modifiers = new Set(keys.slice(0, -1).map((k) => k.toLowerCase()))
  const key = keys.pop()

  if (key == null) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Invalid key config string: \`${str}\`.`)
      console.warn('Not setting up key bind')
    }

    return null
  }

  return {
    altKey: modifiers.has('alt'),
    metaKey: modifiers.has('cmd'),
    ctrlKey: modifiers.has('ctrl'),
    shiftKey: modifiers.has('shift'),
    // we don't care if the user types `Ctrl + Z` or `Ctrl + z`.
    key: key.toLowerCase(),
  }
}

const useKeyEvent =
  (eventName: 'keydown' | 'keyup') =>
  (
    /**
     * string format for a key or key combination,
     * like `['4']`, `['Shift + Alt + Enter']`, or `['Cmd + Z', 'Ctrl + Z']`.
     *
     * supported modifiers are
     *
     * `Alt`
     * `Cmd`
     * `Ctrl`
     * `Shift`
     */
    keyStrings: string[],
    /**
     * function to call when the keys specified in `keyStrings` are pressed.
     */
    cb: (e: KeyboardEvent) => unknown,
    /**
     * this may not be needed in some cases.
     * it's a gotcha if you have dependencies but leave them out
     * because it won't error or show a lint error but it definitely won't work.
     */
    dependencies: DependencyList
  ): boolean => {
    /**
     * most key binds only need one `keyString`, but it's useful
     * to be able to specify multiple, like `Cmd + Z` and `Ctrl + Z`
     * for Mac and Windows.
     */
    const configs = keyStrings
      .map(parseKeyString)
      .filter((c): c is KeyConfig => c != null)

    // we didn't get any properly configured key bind configs.
    if (configs.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `couldn't parse any of the provided keyString(s). \`keyStrings\`:`,
          keyStrings
        )
      }

      return false
    }

    const listeners = configs.map(({ key, ...modifiers }) => {
      const listener = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() !== key.toLowerCase()) return

        const correctModifiers = (
          Object.entries(modifiers) as [keyof KeyConfigModifiers, boolean][]
        ).reduce(
          (acc: boolean, [property, required]) =>
            acc && e[property] === required,
          true
        )

        if (!correctModifiers) return
        cb(e)
      }

      return listener
    })

    useEffect(() => {
      listeners.forEach((listener) =>
        document.addEventListener(eventName, listener)
      )

      return () =>
        listeners.forEach((listener) =>
          document.removeEventListener(eventName, listener)
        )
    }, [keyStrings, cb, ...dependencies])

    return true
  }

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
const useKeyBind = useKeyEvent('keydown')

/**
 * same as `useKeyBind` but attaches your callback to the `'keyup'` event.
 */
const useKeyUp = useKeyEvent('keyup')

export default useKeyBind
export { useKeyBind, useKeyUp }
