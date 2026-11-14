import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrl: './demo.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DemoComponent {

}
