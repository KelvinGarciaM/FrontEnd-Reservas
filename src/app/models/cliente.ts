export class Cliente {
    constructor(
        public cedula: string = '',
        public idTipoCliente: number | null = null,
        public nombre: string = '',
        public apellidos: string = '',
        public telefono: string = '',
        public direccion: string = '',
        public estado: number = 1
    ){}
}