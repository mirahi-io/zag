import type { MachineSrc, StateMachine as S } from "@zag-js/core"
import { WritableSignal, DestroyRef, effect, inject, Signal, signal } from "@angular/core"
import { signalDeep } from "./deep-signal"

type MachineOptions<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject,
> = Omit<S.HookOptions<TContext, TState, TEvent>, "context"> & {
  context?: WritableSignal<S.UserContext<TContext>> | Signal<S.UserContext<TContext>>
}

export function useService<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
  const { actions, state: hydratedState, context } = options ?? {}

  const _machine = typeof machine === "function" ? machine() : machine
  const service = context ? _machine.withContext(context()) : _machine

  afterNextRender(() => {
    service.start(hydratedState)

    if (service.state.can("SETUP")) {
      service.send("SETUP")
    }

    inject(DestroyRef).onDestroy(() => {
      service.stop()
    })
  })

  // TODO effect or afterRenderEffect
  effect(() => {
    service.setOptions({ actions })
  })

  if (context) {
    // TODO deep signal creation and effect
    // watch(context, service.setContext, { deep: true })
    const contextSignal = signalDeep(context)
    effect(() => {
      service.setContext(contextSignal())
    })
  }

  return service
}

export function useMachine<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject,
>(
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: Omit<S.HookOptions<TContext, TState, TEvent>, "context"> & {
    context?: WritableSignal<S.UserContext<TContext>> | Signal<S.UserContext<TContext>>
  },
) {
  const service = useService(machine, options)
  const state = signal(service.state)

  afterNextRender(() => {
    const unsubscribe = service.subscribe((nextState) => {
      state.set(nextState)
    })

    inject(DestroyRef).onDestroy(() => {
      unsubscribe?.()
    })
  })

  return { state, send: service.send, service } as const
}
