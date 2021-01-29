import { Request, Response } from 'express';
import * as queries from '../db/queries';
import { MyResponse } from '../misc/response';
import { sendErrorServer } from '../misc/utils';

const OBJECT = 'Record';
const HISTORY_PAGE_SIZE = 10;

export const getPaginated = async(req: Request, res: Response) => {
    try {
        const page = +(req.query.page ? req.query.page : 1);
        const offset = HISTORY_PAGE_SIZE * (page - 1);
        let response = await queries.getHistoryPaginated(HISTORY_PAGE_SIZE, offset);
        res.json(new MyResponse(`Returning ${OBJECT}s.`, {
            isLastPage: response.rowCount < HISTORY_PAGE_SIZE,
            count: response.rowCount,
            rows: response.rows,
        }));
    } catch (error) {
        console.log(error);
        sendErrorServer(res,`An error ocurred while getting ${OBJECT}s.`, error);
    }
};
export const getPersonaRecords = async(req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        let response = await queries.getPersonaHistory(id);
        res.json(new MyResponse(`Returning ${OBJECT}s.`, response.rows));
    } catch (error) {
        console.log(error);
        sendErrorServer(res,`An error ocurred while getting ${OBJECT}s.`, error);
    }
};
export const getBookRecords = async(req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        let response = await queries.getBookHistory(id);
        res.json(new MyResponse(`Returning ${OBJECT}s.`, response.rows));
    } catch (error) {
        console.log(error);
        sendErrorServer(res,`An error ocurred while getting ${OBJECT}s.`, error);
    }
};