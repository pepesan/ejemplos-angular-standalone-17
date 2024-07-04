import { Component, OnInit } from '@angular/core';
import {Hero} from "./hero";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-main-form',
  standalone: true,
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
      text: 'Really Smart'
    },
    {
      id: 1,
      text: 'Super Flexible'
    },
    {
      id: 2,
      text: 'Super Hot'
    },
    {
      id: 3,
      text: 'Weather Changer'
    }];
  heroes: Hero[] = [];

  constructor() {
    this.model = new Hero(
      0,
      "",
      0, // por defecto es Really Smart
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
