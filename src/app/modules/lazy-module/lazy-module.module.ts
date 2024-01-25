import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyLazyComponent} from "./components/my-lazy/my-lazy.component";
import {RouterModule, Routes} from "@angular/router";
import {DemoComponent} from "./components/demo/demo.component";

const routes: Routes = [
  { path: '', component: MyLazyComponent },
  { path: 'demo', component: DemoComponent },
];

@NgModule({
  declarations: [MyLazyComponent, DemoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})


export class LazyModuleModule {

}
