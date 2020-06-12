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
var express_1 = require("express");
var router = express_1.Router();
var db = __importStar(require("../bd/conexion"));
var jwt = __importStar(require("jsonwebtoken"));
var redis = __importStar(require("../bd/redis"));
//Verificacion de token
function verificarToken(req, res, next) {
    var encabezado = req.headers['authorization'];
    if (typeof encabezado !== 'undefined') {
        var bearerToken = encabezado.split(" ")[1];
        req.token = bearerToken;
        //req.token = "foobar";
        next();
    }
    else {
        res.sendStatus(403);
    }
}
//Funcion middleware para el almacenamiento en caché de datos.
function cache(req, res, next) {
    var id = req.params.id;
    redis.conexion.get(id, function (err, data) {
        if (err)
            throw err;
        if (data !== null) {
            return res.send(data);
        }
        else {
            next();
        }
    });
}
router.post('/login', function (req, res) {
    //const user = {
    //nombre: "parangaracutirimicuaro"
    var nombre = "parangaracutirimicuaro";
    //}
    //jwt.sign({user}, 'secretkey', (err:Error,token:any)=>{
    jwt.sign({ nombre: nombre }, 'secretkey', function (err, token) {
        res.json({
            token: token
        });
    });
});
//Obtener todos los usuarios
router.get('/', verificarToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', function (error, authData) {
        if (error) {
            res.sendStatus(403);
        }
        else {
            db.client.query('SELECT * FROM usuarios', function (error, result) {
                if (error)
                    throw error;
                res.status(200).send(result.rows);
            });
        }
    });
});
//Mostrar un usuario por su id
router.get('/:id', verificarToken, cache, function (req, res) {
    jwt.verify(req.token, 'secretkey', function (error, authData) {
        if (error) {
            res.sendStatus(403);
        }
        else {
            var id = req.params.id;
            db.client.query('SELECT * FROM usuarios WHERE id = $1', [id], function (error, result) {
                if (error)
                    throw error;
                console.log("Resultado traido de postgres");
                return res.status(200).send(result.rows);
            });
        }
    });
});
// Agregar un nuevo usuario
router.post('/', verificarToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', function (error, authData) {
        if (error) {
            return res.sendStatus(403);
        }
        else {
            var usuario = req.body.usuario;
            var persona = JSON.stringify(req.body.persona);
            var habilidades = JSON.stringify(req.body.habilidades);
            var version = 1;
            db.client.query('INSERT INTO USUARIOS (USUARIO,PERSONA,HABILIDADES,VERSION) VALUES($1,$2,$3,$4) RETURNING ID', [usuario, persona, habilidades, version], function (error, result) {
                if (error)
                    throw error;
                var nuevoID = db.client.query('SELECT MAX(id) FROM USUARIOS', function (error, rows) {
                    if (error)
                        throw error;
                    var nuevoID = rows.rows[0].max;
                    //console.log(nuevoID);
                    redis.conexion.setex(nuevoID, 300, JSON.stringify(req.body));
                });
                res.status(200).send("Usuario agregado correctamente");
            });
        }
    });
});
//Actualizar un usuario
router.put('/:id', verificarToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', function (error, authData) {
        if (error) {
            res.sendStatus(403);
        }
        else {
            var id_1 = req.params.id;
            var usuario = req.body.usuario;
            var persona = JSON.stringify(req.body.persona);
            var habilidades = JSON.stringify(req.body.habilidades);
            var version = 2;
            db.client.query('UPDATE usuarios SET usuario=$1,persona=$2,version=$3 WHERE id =$4', [usuario, persona, version, id_1], function (error, result) {
                if (error)
                    throw error;
                redis.conexion.setex(id_1, 300, JSON.stringify(req.body));
                res.status(200).send('Usuario actualizado.');
                //return res.json(result.rows[0]);
            });
        }
    });
});
//Eliminar un usuario
router.delete('/:id', verificarToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', function (error, authData) {
        if (error) {
            res.sendStatus(403);
        }
        else {
            var id_2 = req.params.id;
            db.client.query('DELETE FROM usuarios WHERE id = $1', [id_2], function (error, result) {
                if (error)
                    throw error;
                redis.conexion.del(id_2);
                res.status(200).send('Usuario eliminado.');
                //return res.json(result.rows[0]);
            });
        }
    });
});
exports.default = router;
