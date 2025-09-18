export class ApiResponse<T = any> {
  status: boolean;
  mensaje: string;
  data?: T;

  constructor(status: boolean, mensaje: string, data?: T) {
    this.status = status;
    this.mensaje = mensaje;
    this.data = data;
  }
}
