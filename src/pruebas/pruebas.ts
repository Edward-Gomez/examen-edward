import chai from 'chai';
import chaiHttp from 'chai-http';

//import * as chai from 'chai';
//import chaiHttp = require('chai-http');
//import * as chaiHttp from 'chai-http';
//import app from '../index';
import { app } from './../index';


//Configurar chai
chai.use( chaiHttp );
chai.should();
const should = chai.should();

const expect = chai.expect;
const url = 'http://localhost:8081';
const urlToken = 'http://localhost:8081/users/login';


//-----------------METODOS SIN TOKEN ------------------------------------
describe("Obtener todos los usuarios: ",()=>{
    it('No deberia obtener los usuarios porque no esta autenticado', (done:any) => {
    //("should obtener todos los usuarios", (done:any) => { 
        chai.request(app)   
        //chai.request(app)
            .get('/users')
            //.send({id:0, country: "Croacia", year: 2017, days: 10})
            .end((err,res) => {
                //console.log(res.body);
                res.should.have.status(403);
                //res.should.have.status(200);
                //res.type.should.eql('application/json');
            done();
        });
    });
});

describe('Obtener usuario con id 1: ',()=>{
    it('No deberia obtener usuario con id porque no esta autenticado', (done) => {
        chai.request(app)
            .get('/users/1')
            .end( function(err,res){
                //console.log(res.body)
                //expect(res.body).to.have.property('id').to.be.equal(1);
                res.should.have.status(403);
            done();
        });
    });
});    

describe('Eliminar usuario con id 2: ',()=>{
    it('No deberia eliminar usuario porque no esta autenticado', (done) => {
        chai.request(app)
            .delete('/users/2')
            .end( function(err,res){
                res.should.have.status(403);
            done();
        });
    });
});

describe ("Agregar nuevo usuario", ()=>{
    var usuario = {
        "usuario": "UsuarioAlfonzoTest",
        "persona": {
            "nombre": "Alfonzo",
            "apellido": "Mendoza",
            "edad": 13
        },
        "habilidades":[
            { "nombre": "Cantar", "descripcion": "Cantar en karaoke"}
        ]
    };
    it("No deberia agregar un usuario porque no esta autenticado", (done) => {
        chai.request(url)
            .post("/users")
            .send(usuario)
            .end((err, res) => {
                res.should.have.status(403);           
            });
        done();
    });   
});

describe ("Actualizar el usuario con id 1", ()=>{
    var usuario = {
        "usuario": "UsuarioTestActualizado",
        "persona": {
            "nombre": "Alfonzo",
            "apellido": "Mendoza",
            "edad": 13
        },
        "habilidades":[
            { "nombre": "Cantar", "descripcion": "Cantar en karaoke"}
        ]
    };
    it("No deberia actualizar un usuario porque no esta autenticado", (done) => {
        chai.request(url)
            .put("/users/1")
            .send(usuario)
            .end((err, res) => {
                res.should.have.status(403);           
            });
        done();
    });   
});

//-----------------------------------------------------------------------
//-----------------METODOS CON TOKEN ------------------------------------
//-----------------------------------------------------------------------
describe('USUARIO AUTENTICADO', () => {
    it('Obtener todos los usuarios', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                nombre: "parangaracutirimicuaro"
            })
            .end((error, response) => {
            should.not.exist(error);
            chai.request(app)
            .get('/users')
            .set('authorization', 'Bearer ' + response.body.token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                done();
            });
        });
    });
    //Mostrar id
    it('Obtener el usuarios con id 1', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                nombre: "parangaracutirimicuaro"
            })
            .end((error, response) => {
            should.not.exist(error);
            chai.request(app)
            .get('/users/1')
            .set('authorization', 'Bearer ' + response.body.token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                done();
            });
        });
    });
    
    //Borrar
    it('Eliminar el usuario con id 2', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                nombre: "parangaracutirimicuaro"
            })
            .end((error, response) => {
            should.not.exist(error);
            chai.request(app)
            .delete('/users/2')
            .set('authorization', 'Bearer ' + response.body.token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Usuario eliminado.");
                done();
            });
        });
    });
    //Editar
    it('Actualizar el usuario con id 1', (done) => {
        var usuario = {
            "usuario": "UsuarioTestActualizado",
            "persona": {
                "nombre": "Alfonzo",
                "apellido": "Mendoza",
                "edad": 13
            },
            "habilidades":[
                { "nombre": "Cantar", "descripcion": "Cantar en karaoke"}
            ]
        };

        chai.request(app)
            .post('/users/login')
            .send({
                nombre: "parangaracutirimicuaro"
            })
            .end((error, response) => {
            should.not.exist(error);
            chai.request(app)
            .put('/users/1')
            .set('authorization', 'Bearer ' + response.body.token)
            .set('content-type', 'application/json')
            .send(usuario)
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Usuario editado.");
                done();
            });
        });
    });
    //Nuevo
    it('Agregar un nuevo usuarios', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                nombre: "parangaracutirimicuaro"
            })
            .end((error, response) => {
            should.not.exist(error);
            chai.request(app)
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
                "habilidades":[
                    { "nombre": "Cantar", "descripcion": "Cantar en karaoke"}
                ]
            })
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Usuario agregado.");
                done();
            });
        });
    });
});
  