"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyResponse = void 0;
class MyResponse {
    constructor(message, data, error) {
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
exports.MyResponse = MyResponse;
