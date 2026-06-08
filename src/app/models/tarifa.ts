export class Tarifa{
    constructor(
        public idTarifa: number | null = null,
        public idTipoHabitacion: number | null = null,
        public nombreTarifa: string = '',
        public precioBase: number = 0,
        public fechaInicio: string = '',
        public fechaFin: string = '',
        public descripcion: string = '',
        public estado: number = 1
    ){}
}