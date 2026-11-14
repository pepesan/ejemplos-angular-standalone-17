import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-my-lazy',
    templateUrl: './my-lazy.component.html',
    styleUrl: './my-lazy.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyLazyComponent {



}
