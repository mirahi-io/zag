import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "zag-home",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="index-nav">
      <h2>Angular UI Machines</h2>
      <ul></ul>
    </div>
  `,
  styles: [],
})
export class HomeComponent {}
