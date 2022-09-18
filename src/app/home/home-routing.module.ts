import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";
import {ContentComponent} from "./content/content.component";
// import {SidebarComponent} from "./sidebar/sidebar.component";
import {MessageComponent} from "./message/message.component";
import {ProfileComponent} from "../dashboard/profile/profile.component";
import { AuthGuard } from "../Guards/auth.guard";


const routes: Routes = [

       {path:'',component:HomeComponent},
      { path: 'content', component: ContentComponent },

      { path: 'message', component: MessageComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}
