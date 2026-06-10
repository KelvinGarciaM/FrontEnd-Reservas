export class Habitacion {
    constructor(
        public idHabitacion: number | null = null,
        public idTipoHab: number | null = null,
        public nombreTipoHab: string = '',
        public numeroHabitacion: string = '',
        public estado: number = 1
    ){}
}