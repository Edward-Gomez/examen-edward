import * as con from 'pg';

const url: string = "postgres://ibm_cloud_576c8a05_1b43_44fa_8ad8_875fa2afc680:41fea6c3f4cd7b132d38d046e555cda694e87f278a0ddf7b2ada246b97e26e65@6ab3cfc4-324b-49ae-8464-75a376871b6a.bn2a0fgd0tu045vmv2i0.databases.appdomain.cloud:31990/edward?sslmode=verify-full";
export const client = new con.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false}
});

try{
    client.connect();
    console.log("Conectados a la base de datos Postgres");
}catch{
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
