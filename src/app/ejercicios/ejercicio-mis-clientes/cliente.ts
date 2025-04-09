export class Cliente {
  public id: number;
  public nombre: string;
  public direccion: string;

  constructor(iden: number = 0 ,nombre: string = "", direccion: string = "") {
    this.id = iden;
    this.nombre = nombre;
    this.direccion = direccion;
  }

}
