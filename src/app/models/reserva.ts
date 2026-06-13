export class Reserva {
    constructor(
        public idReserva: number | null = null,
        public idRecepcionista: string = '',
        public idCliente: string = '',
        public nombreCliente: string = '',
        public nombreRecepcionista: string = '', 
        public fechaReserva: string = '', 
        public estadoReserva: string = 'Pendiente',
        public estado: number = 1,
        public iva: number = 0.00,
        public subTotal: number = 0.00,
        public total: number = 0.00
    ) { }
}