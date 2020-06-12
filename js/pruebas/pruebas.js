"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
//import * as chai from 'chai';
//import chaiHttp = require('chai-http');
//import * as chaiHttp from 'chai-http';
//import app from '../index';
var index_1 = require("./../index");
//Configurar chai
chai_1.default.use(chai_http_1.default);
chai_1.default.should();
var should = chai_1.default.should();
var expect = chai_1.default.expect;
var url = 'http://localhost:8081';
var urlToken = 'http://localhost:8081/users/login';
//-----------------METODOS SIN TOKEN ------------------------------------
describe("Obtener todos los usuarios: ", function () {
    it('No deberia obtener los usuarios porque no esta autenticado', function (done) {
        //("should obtener todos los usuarios", (done:any) => { 
        chai_1.default.request(index_1.app)
            //chai.request(app)
            .get('/users')
            //.send({id:0, country: "Croacia", year: 2017, days: 10})
            .end(function (err, res) {
            //console.log(res.body);
            res.should.have.status(403);
            //res.should.have.status(200);
            //res.type.should.eql('application/json');
            done();
        });
    });
});
describe('Obtener usuario con id 1: ', function () {
    it('No deberia obtener usuario con id porque no esta autenticado', function (done) {
        chai_1.default.request(index_1.app)
            .get('/users/1')
            .end(function (err, res) {
            //console.log(res.body)
            //expect(res.body).to.have.property('id').to.be.equal(1);
            res.should.have.status(403);
            done();
        });
    });
});
describe('Eliminar usuario con id 2: ', function () {
    it('No deberia eliminar usuario porque no esta autenticado', function (done) {
        chai_1.default.request(index_1.app)
            .delete('/users/2')
            .end(function (err, res) {
            res.should.have.status(403);
            done();
        });
    });
});
describe("Agregar nuevo usuario", function () {
    var usuario = {
        "usuario": "UsuarioAlfonzoTest",
        "persona": {
            "nombre": "Alfonzo",
            "apellido": "Mendoza",
            "edad": 13
        },
        "habilidades": [
            { "nombre": "Cantar", "descripcion": "Cantar en karaoke" }
        ]
    };
    it("No deberia agregar un usuario porque no esta autenticado", function (done) {
        chai_1.default.request(url)
            .post("/users")
            .send(usuario)
            .end(function (err, res) {
            res.should.have.status(403);
        });
        done();
    });
});
describe("Actualizar el usuario con id 1", function () {
    var usuario = {
        "usuario": "UsuarioTestActualizado",
        "persona": {
            "nombre": "Alfonzo",
            "apellido": "Mendoza",
            "edad": 13
        },
        "habilidades": [
            { "nombre": "Cantar", "descripcion": "Cantar en karaoke" }
        ]
    };
    it("No deberia actualizar un usuario porque no esta autenticado", function (done) {
        chai_1.default.request(url)
            .put("/users/1")
            .send(usuario)
            .end(function (err, res) {
            res.should.have.status(403);
        });
        done();
    });
});
//-----------------------------------------------------------------------
//-----------------METODOS CON TOKEN ------------------------------------
//-----------------------------------------------------------------------
describe('USUARIO AUTENTICADO', function () {
    it('Obtener todos los usuarios', function (done) {
        chai_1.default.request(index_1.app)
            .post('/users/login')
            .send({
            nombre: "parangaracutirimicuaro"
        })
            .end(function (error, response) {
            should.not.exist(error);
            chai_1.default.request(index_1.app)
                .get('/users')
                .set('authorization', 'Bearer ' + response.body.token)
                .set('content-type', 'application/json')
                .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                done();
            });
        });
    });
    //Mostrar id
    it('Obtener el usuarios con id 1', function (done) {
        chai_1.default.request(index_1.app)
            .post('/users/login')
            .send({
            nombre: "parangaracutirimicuaro"
        })
            .end(function (error, response) {
            should.not.exist(error);
            chai_1.default.request(index_1.app)
                .get('/users/1')
                .set('authorization', 'Bearer ' + response.body.token)
                .set('content-type', 'application/json')
                .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                done();
            });
        });
    });
    //Borrar
    it('Eliminar el usuario con id 2', function (done) {
        chai_1.default.request(index_1.app)
            .post('/users/login')
            .send({
            nombre: "parangaracutirimicuaro"
        })
            .end(function (error, response) {
            should.not.exist(error);
            chai_1.default.request(index_1.app)
                .delete('/users/2')
                .set('authorization', 'Bearer ' + response.body.token)
                .set('content-type', 'application/json')
                .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Usuario eliminado.");
                done();
            });
        });
    });
    //Editar
    it('Actualizar el usuario con id 1', function (done) {
        var usuario = {
            "usuario": "UsuarioTestActualizado",
            "persona": {
                "nombre": "Alfonzo",
                "apellido": "Mendoza",
                "edad": 13
            },
            "habilidades": [
                { "nombre": "Cantar", "descripcion": "Cantar en karaoke" }
            ]
        };
        chai_1.default.request(index_1.app)
            .post('/users/login')
            .send({
            nombre: "parangaracutirimicuaro"
        })
            .end(function (error, response) {
            should.not.exist(error);
            chai_1.default.request(index_1.app)
                .put('/users/1')
                .set('authorization', 'Bearer ' + response.body.token)
                .set('content-type', 'application/json')
                .send(usuario)
                .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Usuario editado.");
                done();
            });
        });
    });
    //Nuevo
    it('Agregar un nuevo usuarios', function (done) {
        chai_1.default.request(index_1.app)
            .post('/users/login')
            .send({
            nombre: "parangaracutirimicuaro"
        })
            .end(function (error, response) {
            should.not.exist(error);
            chai_1.default.request(index_1.app)
                .post('/users')
                .set('authorization', 'Bearer ' + response.body.token)
                .set('content-type', 'application/json')
                .send({
                "usuario": "UsuarioTestNuevo",
                "persona": {
                    "nombre": "Alfonzo",
                    "apellido": "Mendoza",
                    "edad": 13
                },
                "habilidades": [
                    { "nombre": "Cantar", "descripcion": "Cantar en karaoke" }
                ]
            })
                .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Usuario agregado.");
                done();
            });
        });
    });
});
