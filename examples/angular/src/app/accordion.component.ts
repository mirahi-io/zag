import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "zag-accordion",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="index-nav">
      <h2>Accordion</h2>
      <ul></ul>
    </div>
  `,
  styles: [],
})
export class AccordionComponent {}

export default AccordionComponent
