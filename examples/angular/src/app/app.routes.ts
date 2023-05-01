import { Route, Routes } from "@angular/router"
import { HomeComponent } from "./home.component"

type RouteData = {
  path: `/${string}`
  label: string
}

export const routesData: RouteData[] = [
  { label: "Color Picker", path: "/color-picker" },
  { label: "Switch", path: "/switch" },
  { label: "Carousel", path: "/carousel" },
  { label: "Transition", path: "/transition" },
  { label: "Date Picker (Single)", path: "/date-picker" },
  { label: "Date Picker (Range)", path: "/date-picker-range" },
  { label: "Date Picker (Multi)", path: "/date-picker-multi" },
  { label: "Select", path: "/select" },
  { label: "Accordion", path: "/accordion" },
  { label: "Checkbox", path: "/checkbox" },
  { label: "Combobox", path: "/combobox" },
  { label: "Editable", path: "/editable" },
  { label: "Dialog", path: "/dialog" },
  { label: "Dialog Default Open", path: "/dialog-default-open" },
  { label: "Hover Card", path: "/hover-card" },
  { label: "Menu", path: "/menu" },
  { label: "Nested Menu", path: "/nested-menu" },
  { label: "Menu With options", path: "/menu-options" },
  { label: "Context Menu", path: "/context-menu" },
  { label: "Number Input", path: "/number-input" },
  { label: "Pagination", path: "/pagination" },
  { label: "Pin Input", path: "/pin-input" },
  { label: "Popper", path: "/popper" },
  { label: "Popover", path: "/popover" },
  { label: "Pressable", path: "/pressable" },
  { label: "Nested Popover", path: "/nested-popover" },
  { label: "Radio Group", path: "/radio-group" },
  { label: "Range Slider", path: "/range-slider" },
  { label: "Rating Group", path: "/rating-group" },
  { label: "Slider", path: "/slider" },
  { label: "Tabs", path: "/tabs" },
  { label: "Tags Input", path: "/tags-input" },
  { label: "Toast", path: "/toast" },
  { label: "Tooltip", path: "/tooltip" },
  { label: "Splitter", path: "/splitter" },
]

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
