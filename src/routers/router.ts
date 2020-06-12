import {Router, Request, Response, Next} from 'express';
const router = Router();
import * as db from '../bd/conexion';
import * as jwt from 'jsonwebtoken';
import * as redis from "../bd/redis";

//Verificacion de token
function verificarToken(req: Request, res: Response, next:Next){
    const encabezado = req.headers['authorization'];
  
    if(typeof encabezado !== 'undefined'){
      const bearerToken = encabezado.split(" ")[1];
      req.token = bearerToken;
      //req.token = "foobar";
      next();
    }else{
      res.sendStatus(403);
    }
}

//Funcion middleware para el almacenamiento en caché de datos.
function cache(req:Request, res:Response, next:Next) {
    const id = req.params.id;
    redis.conexion.get(id, (err:Error, data:any) => {
        if (err) throw err;
        
        if (data !== null) {
            return res.send(data);
        } else {
            next();
        }
    });
}

router.post('/login', (req:Request, res:Response)=>{
    //const user = {
        //nombre: "parangaracutirimicuaro"
      const nombre= "parangaracutirimicuaro";
    //}
    //jwt.sign({user}, 'secretkey', (err:Error,token:any)=>{
    jwt.sign({nombre}, 'secretkey', (err:Error,token:any)=>{    
        res.json({
            token
        });
    });
});


//Obtener todos los usuarios
router.get('/', verificarToken, function (req: Request, res: Response) {
    jwt.verify(req.token, 'secretkey',(error:Error, authData:any)=>{ //Revizar los tipos
        if(error){
          res.sendStatus(403);
        }else{
            db.client.query('SELECT * FROM usuarios', (error:Error, result:any) => {
                if (error) throw error;
         
                res.status(200).send(result.rows);
            });  
        }
    });   
}); 

//Mostrar un usuario por su id
router.get('/:id', verificarToken, cache, (req:Request, res:Response) => {
    jwt.verify(req.token, 'secretkey',(error:Error, authData:any)=>{ //Revizar los tipos
        if(error){
          res.sendStatus(403);
        }else{
            const id = req.params.id;
            
            db.client.query('SELECT * FROM usuarios WHERE id = $1', [id], (error:Error, result:any) => {
                if (error) throw error;
                console.log("Resultado traido de postgres");
                return res.status(200).send(result.rows);     
            });
        }
    });        
});

// Agregar un nuevo usuario
router.post('/', verificarToken, (req:Request, res:Response) => {
    jwt.verify(req.token, 'secretkey',(error:Error, authData:any)=>{ //Revizar los tipos
        if(error){
          return res.sendStatus(403);
        }else{                  
            let usuario: string = req.body.usuario;
            let persona:any = JSON.stringify(req.body.persona);

            let habilidades: any = JSON.stringify(req.body.habilidades);
            let version : number = 1;
            
            db.client.query('INSERT INTO USUARIOS (USUARIO,PERSONA,HABILIDADES,VERSION) VALUES($1,$2,$3,$4) RETURNING ID' , [usuario,persona,habilidades,version], (error:Error, result:any) => {
                if (error) throw error;
                
                
                let nuevoID = db.client.query('SELECT MAX(id) FROM USUARIOS',(error:Error, rows: any)=>{
                    if (error) throw error;

                    let nuevoID = rows.rows[0].max;
                    //console.log(nuevoID);
                    redis.conexion.setex(nuevoID,300, JSON.stringify(req.body));
                });
                

                res.status(200).send("Usuario agregado correctamente");
            });  
        }
    });        
});

//Actualizar un usuario
router.put('/:id', verificarToken, (req:Request, res:Response) => {
    jwt.verify(req.token, 'secretkey',(error:Error, authData:any)=>{ //Revizar los tipos
        if(error){
          res.sendStatus(403);
        }else{    
            const id = req.params.id;
            let usuario: string = req.body.usuario;
            let persona:any = JSON.stringify(req.body.persona);

            let habilidades: any = JSON.stringify(req.body.habilidades);
            let version : number = 2;

            db.client.query('UPDATE usuarios SET usuario=$1,persona=$2,version=$3 WHERE id =$4', [usuario,persona,version,id], (error:Error, result:any) => {
                if (error) throw error;
                
                redis.conexion.setex(id,300, JSON.stringify(req.body));
                res.status(200).send('Usuario actualizado.');
                //return res.json(result.rows[0]);
            });        
        }
    });        
});

//Eliminar un usuario
router.delete('/:id', verificarToken, (req:Request, res:Response) => {
    jwt.verify(req.token, 'secretkey',(error:Error, authData:any)=>{ //Revizar los tipos
        if(error){
          res.sendStatus(403);
        }else{            
            const id = req.params.id;
            db.client.query('DELETE FROM usuarios WHERE id = $1', [id], (error:Error, result:any) => {
            if (error) throw error;
 
            redis.conexion.del(id);
            res.status(200).send('Usuario eliminado.');
            //return res.json(result.rows[0]);
    });
        }
    });        
});

export default router;