//imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

//arrancar el servidor
const app = express();

//configurar

app.use(cors());
app.use(express.json());

//conexión a la bases de datos
async function getConnection() {
  //crear y configurar la conexion
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ffuunnaaii",
    database: "ghibli",
  });

  connection.connect();
  return connection;
}

const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

//Endpoints
//Obtener todas las recetas (GET /recetas)
app.get("/moviesghibli", async (req, res) => {
  //Select a la bases de datos
  let query = "SELECT * FROM moviesghibli JOIN postersghibli ON moviesghibli.id = postersghibli.fk_movieposters;"

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(query);
  const numOfElements = results.length;

  //Enviar una respuesta
  res.json({
    info: { count: numOfElements }, // número de elementos
    results: results, // listado
  });
});

//Obtener una receta por su ID (GET /recetas/:id).
app.get("/moviesghibli/:id", async (req, res) => {
  //Obtener el id: url params
  const idMovie = req.params.id;

  if (isNaN(parseInt(idMovie))) {
    res.json({
      success: false,
      error: "El id debe ser un número",
    });
    return;
  }

  //Select a la bases de datos con un id
  let query = 'SELECT * FROM moviesghibli LEFT JOIN postersghibli ON moviesghibli.id = postersghibli.fk_movieposters WHERE moviesghibli.id = ?;';

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(query, [idMovie]);
  const numOfElements = results.length;

  if (numOfElements === 0) {
    res.json({
      success: true,
      message: "No existe la película de estudios ghibli que buscas en nuestros datos",
    });
    return;
  }

  //Enviar una respuesta
  res.json({
    results: results[0] 
  });
});

//Crear una nueva receta (POST /recetas)
app.post("/moviesghibli", async (req, res) => {
  const dataMovie = req.body; //objeto
  const { nombre, anio, director, descripcion } = dataMovie;
  const dataPoster = req.body;
  const {poster} = dataPoster;

  //Validaciones
  //Validar que viene el nombre, ingredientes y las instrucciones -- res.json(error)

  let sql = "INSERT INTO moviesghibli (nombre, anio, director, descripcion) VALUES (?, ?, ?, ?);";
  let sql2 = "INSERT INTO postersghibli (poster, fk_movieposters) VALUES (?, ?);";
  try {
    //hacer la conexión con la BD
    const conn = await getConnection();

    //Ejecutar esa consulta
    const [results] = await conn.query(sql, [
      nombre,
      anio,
      director,
      descripcion
    ]);

    const [results2] = await conn.query(sql2, [
      poster,
      results.insertId
    ]);

    // Valida si la receta ya existe, o está duplicada
    //validar si se ha insertado o no
    if (results.affectedRows === 0) {
      res.json({
        success: false,
        message: "No se ha podido insertar",
      });
      return;
    }

    res.json({
      success: true,
      idMovie: results.insertId, 
      idPoster: results2.insertId,
      message: "La película se ha insertado correctamente"// id que generó MySQL para la nueva fila
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error${error}`,
    });
  }
});

//Actualizar una receta existente (PUT /recetas/:id)
//id: url params
//info actualizar: Body params
app.put("/moviesghibli/:id", async (req, res) => {
  //Obtener los valores del req.body
  const dataMovie = req.body; //objeto
  const { nombre, anio, director, descripcion } = dataMovie;
  const dataPoster = req.body;
  const {poster} = dataPoster;

  //Obtener el id del req.params
  const idMovie = req.params.id;

  //buscar si este id existe en mi bd

  let sql = "UPDATE moviesghibli JOIN postersghibli ON moviesghibli.id = postersghibli.fk_movieposters SET moviesghibli.nombre = ?, moviesghibli.anio = ?, moviesghibli.director = ?, moviesghibli.descripcion= ?, postersghibli.poster = ? WHERE id = ?;";
 

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(sql, [
    nombre,
    anio,
    director,
    descripcion,
    poster
  ]);

  res.json({
    success: true,
    message: "Datos actualizados correctamente",
  });
});

//Eliminar una receta (DELETE /recetas/:id)
//id: url params
app.delete("/moviesghibli/:id", async (req, res) => {
  //Obtener el id del req.params
  const idMovie = req.params.id;

  //buscar si este id existe en mi bd
  //Puedo hacer un select a la BD si exste hago el delete
  //Sino existe envio una res.json(error)

  let sql = "DELETE FROM recetas WHERE id = ? ";

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(sql, [idMovie]);

  res.json({
    success: true,
    message: "Película eliminada correctamente",
  });
});