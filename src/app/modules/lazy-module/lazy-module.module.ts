import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyLazyComponent} from "./components/my-lazy/my-lazy.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', component: MyLazyComponent },
];

@NgModule({
  declarations: [MyLazyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})


export class LazyModuleModule {

}
