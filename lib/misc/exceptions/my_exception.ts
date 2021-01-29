export class MyException {
    constructor(
        public code:number | null,
        public log?:string,
    ){}
}