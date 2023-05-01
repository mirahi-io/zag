import type { Machine, StateMachine as S } from "@zag-js/core"
import { DestroyRef, inject, signal } from "@angular/core"

export function useActor<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject,
>(service: Machine<TContext, TState, TEvent>) {
  const state = signal(service.state)

  afterNextRender(() => {
    const unsubscribe = service.subscribe((nextState) => {
      state.set(nextState)
    })

    inject(DestroyRef).onDestroy(() => {
      unsubscribe?.()
    })
  })

  return { state, send: service.send } as const
}
