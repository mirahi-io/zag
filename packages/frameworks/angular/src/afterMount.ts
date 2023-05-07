import { signal } from "@angular/core"

export function afterMount(fn: any) {
  const mounted = signal(false)
  const effectRef = afterRenderEffect(() => {
    if (mounted()) {
      effectRef?.destroy()
      return
    }
    fn?.()
    effectRef?.destroy()
  })
}
