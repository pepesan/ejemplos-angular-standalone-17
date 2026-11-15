import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-root',
    imports: [
        RouterModule,
        NgbModule
    ],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
}
