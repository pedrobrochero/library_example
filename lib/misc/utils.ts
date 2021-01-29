import { Response } from 'express';
import { MyException } from './exceptions/my_exception';
import { MyResponse } from './response';

export const checkForMandatoryFields = (res:Response, body:any, fields:string[]) => {
    for (const f of fields) {
        if (!body[f]) {
            console.log(`You have not provided this mandatory field: ${f}.`);
            res.status(400).json(new MyResponse(`You have not provided some of the mandatory fields: ${fields}.`));
            return false;
        }
    }
    return true;
}
export const sendErrorServer = (res:Response, message:string, error:any) => {
    res.status(500).json(new MyResponse(message,null,new MyException(null,error)));
}
