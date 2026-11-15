import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [RouterModule],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './home.component.css'
})
export class HomeComponent {

}
