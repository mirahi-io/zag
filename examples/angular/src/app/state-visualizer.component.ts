import { Component, computed, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { stringifyState } from "@zag-js/shared"

@Component({
  selector: "zag-state-visualizer",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="viz">
      <pre>
        <details open>
          <summary> {{label }} </summary>
          <div [innerHTML]="html()"></div>
        </details>
      </pre>
    </div>
  `,
  styles: [],
})
export class StateVisualizerComponent {
  @Input()
  label: string = "Visualizer"

  @Input()
  omit: string[] = []

  // TODO handle signal input
  @Input()
  state: Record<string, any> = {}

  html = computed(() => stringifyState(this.state as any, this.omit))
}

export default StateVisualizerComponent
