import { MyException } from "./exceptions/my_exception";

export class MyResponse {
    constructor(
        public message:string,
        public data?:any,
        public error?:MyException,
    ) {}
}