export class Todo {
  public id: number;
  public text: string;
  constructor(id: number = 0, text: string = "") {
    this.id = id;
    this.text = text;
  }
}
