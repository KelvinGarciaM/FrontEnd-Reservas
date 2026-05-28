export class Reserva {
    constructor(
        public idReserva: number | null = null,
        public idRecepcionista: string = '',
        public idCliente: string = '',
        public fechaReserva: string = '', // Formato string para inputs tipo 'date' o 'datetime-local'
        public estadoReserva: string = 'Pendiente',
        public estado: number = 1,
        public iva: number = 0.00,
        public subTotal: number = 0.00,
        public total: number = 0.00
    ){}
}