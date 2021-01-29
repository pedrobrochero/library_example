"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorServer = exports.checkForMandatoryFields = void 0;
const my_exception_1 = require("./exceptions/my_exception");
const response_1 = require("./response");
exports.checkForMandatoryFields = (res, body, fields) => {
    for (const f of fields) {
        if (!body[f]) {
            console.log(`You have not provided this mandatory field: ${f}.`);
            res.status(400).json(new response_1.MyResponse(`You have not provided some of the mandatory fields: ${fields}.`));
            return false;
        }
    }
    return true;
};
exports.sendErrorServer = (res, message, error) => {
    res.status(500).json(new response_1.MyResponse(message, null, new my_exception_1.MyException(null, error)));
};
