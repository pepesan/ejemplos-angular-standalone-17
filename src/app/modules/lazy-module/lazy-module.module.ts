import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyLazyComponent} from "./components/my-lazy/my-lazy.component";
import {RouterModule, Routes} from "@angular/router";
import {DemoComponent} from "./components/demo/demo.component";

const routes: Routes = [
  { path: '', component: MyLazyComponent, data: { fuente: 'src/app/modules/lazy-module/components/my-lazy/my-lazy.component.ts' } },
  { path: 'demo', component: DemoComponent, data: { fuente: 'src/app/modules/lazy-module/components/demo/demo.component.ts' } },
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
