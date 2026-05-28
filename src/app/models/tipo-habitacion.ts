export class TipoHabitacion {
    constructor(
        public idTipoHabitacion: number | null = null,
        public nombreTipoHab: string = '',
        public descripcion: string = '',
        public capacidadMaxima: number | null = null,
        public estado: number = 1
    ){}
}