import { Request, Response } from 'express';
import * as queries from '../db/queries';
import { MyResponse } from '../misc/response';
import { checkForMandatoryFields, sendErrorServer } from '../misc/utils';

const OBJECT = 'Persona';

export const create = async (req: Request, res: Response) => {
    const body = req.body;
    if (!checkForMandatoryFields(res, body, ['name'])) return;
    try {
        const response = await queries.createPersona(body.name);
        res.status(201).json(new MyResponse(`${OBJECT} created successfully.`, response.rows[0].id));
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while creating the ${OBJECT}.`, error);
    }
};
export const get = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const response = await queries.getPersona(id);
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
        await queries.updatePersona(id, body.name);
        res.status(204).end();
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while updating ${OBJECT}.`, error);
    }
}
export const remove = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        await queries.deletePersona(id);
        res.status(204).end();
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while deleting ${OBJECT}.`, error);
    }
}
export const search = async (req: Request, res: Response) => {
    const query = req.params.query;
    try {
        const response = await queries.searchPersona(query);
        if (response.rowCount == 0) return res.status(404).json(new MyResponse(`No ${OBJECT} found with that query`));
        res.json(new MyResponse('Returning data',  response.rows));
    } catch (error) {
        sendErrorServer(res, `An error has ocurred while searching ${OBJECT}s.`, error);
    }
}

