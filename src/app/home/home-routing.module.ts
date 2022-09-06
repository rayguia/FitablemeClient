import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";
import {ContentComponent} from "./content/content.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {MessageComponent} from "./message/message.component";
import {ProfileComponent} from "./profile/profile.component";


const routes: Routes = [
  { path: '', component: HomeComponent, children: [
      { path: 'content', component: ContentComponent },
      { path: 'sidebar', component: SidebarComponent },
      { path: 'message', component: MessageComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'content', pathMatch: 'full' }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}
