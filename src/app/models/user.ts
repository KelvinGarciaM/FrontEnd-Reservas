export class User {
    constructor(
        public id: number | null,
        public name: string,
        public email: string,
        public role: string,
        public estado: number, 
        public image?: string, 
        public password?: string,
        public cedula:    string = ''
    ){}
}