"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
config_1.default(); // Execute before importing routes
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Routes
app.use(process.env.SUBDIR, routes_1.default);
app.listen(process.env.PORT, () => {
    console.log('Listening port:', process.env.PORT);
});
