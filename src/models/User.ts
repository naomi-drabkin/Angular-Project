export enum Role{
    student = "student",
    teacher = "teacher",
    admin = "admin"}


export class User{
    constructor(public id:number,
        public name: string, 
        public email: string,
        public password: string,
        public role: Role
    ){}
}