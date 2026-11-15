import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about',
    imports: [RouterModule],
    templateUrl: './about.component.html',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class AboutComponent {

}
