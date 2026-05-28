export class Recepcionista {
    constructor(
        public cedula: string = '',
        public nombre: string = '',
        public apellidos: string = '',
        public telefono: string = '',
        public correo: string = '',
        public estado: number = 1
    ){}
}