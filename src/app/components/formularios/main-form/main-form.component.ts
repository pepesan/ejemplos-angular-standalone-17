import { Component, OnInit } from '@angular/core';
import {Hero} from "./hero";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-main-form',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './main-form.component.html',
    styleUrls: ['./main-form.component.sass']
})
export class MainFormComponent implements OnInit {
  public model: Hero;
  public showedModel: Hero;
  public powers: any[] =  [
    {
      id: 0,
      text: 'None'
    },
    {
      id: 1,
      text: 'Really Smart'
    },
    {
      id: 2,
      text: 'Super Flexible'
    },
    {
      id: 3,
      text: 'Super Hot'
    },
    {
      id: 4,
      text: 'Weather Changer'
    }];
  heroes: Hero[] = [];

  constructor() {
    this.model = new Hero(
      0,
      "",
      0, // por defecto es None
      "");
    this.showedModel = new Hero();
  }

  ngOnInit(): void {
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.model);
    this.heroes.push(new Hero(0,this.model.name, this.model.power, this.model.alterEgo));
    this.showedModel = new Hero(0,this.model.name, this.model.power, this.model.alterEgo);
    this.model = new Hero(0,"",0,"");
  }
}
