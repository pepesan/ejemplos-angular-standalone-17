import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-child-a',
    imports: [],
    templateUrl: './child-a.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './child-a.component.css'
})
export class ChildAComponent {

}
