import { Component, computed, inject, OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router"
// TODO fix import on shared
// import { routesData } from "@zag-js/shared"
import * as sharedTwo from "@zag-js/shared"
import { toSignal } from "@angular/core/rxjs-interop"
import { routesData } from "./app.routes"
import { dataAttr } from "@zag-js/dom-query"

console.log("dataAttr", sharedTwo, dataAttr)
@Component({
  selector: "zag-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="page">
      <aside class="nav">
        <header>Zagjs</header>
        <a *ngFor="let item of items()" [routerLink]="item.path" [attr.data-active]="item.dataActive">
          {{ item.label }}
        </a>
      </aside>

      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ["../../../../shared/src/style.css"],
})
export class AppComponent implements OnInit {
  activeRoute = toSignal(inject(ActivatedRoute).url)
  items = computed(() => {
    return routesData
      ?.sort((a, b) => a.label.localeCompare(b.label))
      ?.map((route) => {
        const pathname = this.activeRoute()?.[0]?.path
        const active = pathname === route.path
        return {
          dataActive: dataAttr(active),
          path: route.path,
          label: route.label,
        }
      })
  })

  constructor() {}

  ngOnInit(): void {}
}
