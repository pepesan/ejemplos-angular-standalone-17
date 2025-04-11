export class Formulario {
  constructor(
    public id: number = 0,
    public username: string = "",
    public password: string= "",
    public repeatPassword: string= "",
    public email: string= "",
    public gender: string= "",
    public orientation: string= "hetero",
    public relationType: number= 3,
    public conditions: boolean = false
  ) {  }
}
