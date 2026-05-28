export class User {
    constructor(
        public id: number | null,
        public name: string,
        public email: string,
        public role: string,
        public estado: number, // 1 para activo, 0 para inactivo
        public image?: string, // Opcional con '?' por si no tiene foto de perfil
        public password?: string // Opcional porque el backend nunca te lo va a devolver en el login
    ){}
}