import { Routes } from "@angular/router"
import { HomeComponent } from "./home.component"

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
  },
  {
    path: "accordion",
    loadComponent: () => import("./accordion.component"),
  },
]
