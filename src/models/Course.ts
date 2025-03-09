import { lessons } from "./Lesson";
import { User } from "./User";

export class Course{
    constructor(public id: number,
        public title: string, 
        public description: string,
        public teacher: Number,
        public lessons:lessons[],
    ){}
}