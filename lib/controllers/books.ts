import { Request, Response } from 'express';
import * as queries from '../db/queries';
import { MyResponse } from '../misc/response';
import { checkForMandatoryFields, sendErrorServer } from '../misc/utils';

const OBJECT = 'Book';

export const create = async (req: Request, res: Response) => {
    const body = req.body;
    if (!checkForMandatoryFields(res, body, ['name'])) return;
    try {
        const response = await queries.createBook(body.name, body.author, body.year);
        res.status(201).json(new MyResponse(`${OBJECT} created successfully.`, response.rows[0].id));
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while creating the ${OBJECT}.`, error);
    }
};
export const get = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const response = await queries.getBook(id);
        if (response.rowCount == 0) return res.status(404).json(new MyResponse(`${OBJECT} not found`));
        res.json(new MyResponse('Returning data', response.rows[0]));
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while getting the ${OBJECT}.`, error);
    }
}
export const update = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        const id = +req.params.id;
        await queries.updateBook(id, body.name, body.author, body.year);
        res.status(204).end();
    } catch (error) {
        sendErrorServer(res, 'An error has ocurred while updating item.', error);
    }
}
export const remove = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        await queries.deleteBook(id);
        res.status(204).end();
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while deleting ${OBJECT}.`, error);
    }
}
export const search = async (req: Request, res: Response) => {
    const query = req.params.query;
    try {
        const response = await queries.searchBook(query);
        if (response.rowCount == 0) return res.status(404).json(new MyResponse(`No ${OBJECT} found with that query`));
        res.json(new MyResponse('Returning data',  response.rows));
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while searching ${OBJECT}s.`, error);
    }
}

export const lend = async (req: Request, res: Response) => {
    const body = req.body;
    if (!checkForMandatoryFields(res, body, ['persona_id'])) return;
    try {
        const bookId = +req.params.id;
        // Check for valid ids
        if (isNaN(bookId) || isNaN(+body.persona_id)) {
            return res.status(400).json(new MyResponse('You have provided invalid(s) id(s).',{
                persona_id: body.persona_id,
                book_id: req.params.id,
            }))
        }
        // Check if book is NOT lent
        const response = await queries.getBook(bookId);
        if (response.rows[0].is_lend == true) {
            return res.status(400).json(new MyResponse('This book is already lent.'));
        }
        
        await queries.lendBook(bookId, body.persona_id);
        res.status(204).end();
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while lending ${OBJECT}.`, error);
    }
}
export const giveback = async (req: Request, res: Response) => {
    const body = req.body;
    if (!checkForMandatoryFields(res, body, ['persona_id'])) return;
    try {
        const bookId = +req.params.id;
        // Check for valid ids
        if (isNaN(bookId) || isNaN(+body.persona_id)) {
            return res.status(400).json(new MyResponse('You have provided invalid(s) id(s).',{
                persona_id: body.persona_id,
                book_id: req.params.id,
            }))
        }
        // Check if book is lent
        const response = await queries.getBook(bookId);
        if (response.rows[0].is_lend == false) {
            return res.status(400).json(new MyResponse('This book is not lent, you cannot return it.'));
        }
        
        await queries.returnBook(bookId, body.persona_id);
        res.status(204).end();
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while returning ${OBJECT}.`, error);
    }
}