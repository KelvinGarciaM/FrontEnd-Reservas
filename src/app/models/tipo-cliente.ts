export class TipoCliente {
    constructor(
        public idTipoCliente: number | null = null,
        public nombreTipoC: string = '',
        public descripcion: string = '',
        public descuentoBase: number = 0.00,
        public estado: number = 1
    ){}
}