import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {HomeComponent} from "./home.component";
// import {SidebarComponent} from "./sidebar/sidebar.component";
import {MenuComponent} from "./menu/menu.component";
import {ContentComponent} from "./content/content.component";
import {HomeRoutingModule} from "./home-routing.module";
import { HeaderComponent } from "../shared/header/header.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
declarations: [
  HomeComponent,
  // SidebarComponent,
  MenuComponent,
  ContentComponent
],
  imports: [
    HomeRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule
  ]
})

export class HomeModule {}
