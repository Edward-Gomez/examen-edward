"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
//import * as body from 'body-parser';
var router_1 = __importDefault(require("./routers/router"));
exports.app = express_1.default();
// middlewares
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
// Routes
//app.use('/', indexRouter);
exports.app.use('/users', router_1.default);
var puerto = 8081;
exports.app.listen(puerto);
console.log('Server on port', puerto);
