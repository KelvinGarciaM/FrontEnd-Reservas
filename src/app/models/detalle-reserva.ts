export class DetalleReserva {
    constructor(
        public idDetalleReserva:     number | null = null,
        public idHabitacion:         number | null = null,
        public idReserva:            number | null = null,
        public idTarifa:             number | null = null,
        public cantidadPersonas:     number = 1,
        public precioAplicado:       number = 0.00,
        public fechaEntrada:         string = '',
        public fechaSalida:          string = '',
        public iva:                  number = 0.00,
        public subTotal:             number = 0.00,
        public total:                number = 0.00,
        public estado:               number = 1,
        public nombreTipoHabitacion: string = '',
        public numeroHabitacion:     string = '',
        public nombreTarifa:         string = '',  // ← nuevo
        public descuentoBase:        number = 0    // ← nuevo
    ){}
}