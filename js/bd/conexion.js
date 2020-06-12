"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var con = __importStar(require("pg"));
var url = "postgres://ibm_cloud_576c8a05_1b43_44fa_8ad8_875fa2afc680:41fea6c3f4cd7b132d38d046e555cda694e87f278a0ddf7b2ada246b97e26e65@6ab3cfc4-324b-49ae-8464-75a376871b6a.bn2a0fgd0tu045vmv2i0.databases.appdomain.cloud:31990/edward?sslmode=verify-full";
exports.client = new con.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
});
try {
    exports.client.connect();
    console.log("Conectados a la base de datos Postgres");
}
catch (_a) {
    console.log("Error en la conexion Postgres");
}
/*
//Conexion local
export const client = new con.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    password: 'manager',
    database: 'usuariosexpress',
    port: 5432
});
*/
