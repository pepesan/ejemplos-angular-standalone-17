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
  public powers: string[] =  [
    'Really Smart',
    'Super Flexible',
    'Super Hot',
    'Weather Changer'];
  heroes: Hero[] = [];

  constructor() {
    this.model = new Hero(0,"",this.powers[0],"");
    this.showedModel = new Hero();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.model);
    this.heroes.push(new Hero(0,this.model.name, this.model.power, this.model.alterEgo));
    this.showedModel = new Hero(0,this.model.name, this.model.power, this.model.alterEgo)
    this.model = new Hero(0,"",this.powers[0],"");
  }
}
