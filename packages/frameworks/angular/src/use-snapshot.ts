import { snapshot, subscribe } from "@zag-js/store"
import { DestroyRef, inject, signal } from "@angular/core"

export const useSnapshot = <T extends object>(object: T) => {
  const state = signal({} as T)
  const unsubscribe = subscribe(object, () => {
    // TODO fix typing here
    state.set(snapshot(object) as unknown as T)
  })

  inject(DestroyRef).onDestroy(() => {
    unsubscribe?.()
  })
  return state
}
