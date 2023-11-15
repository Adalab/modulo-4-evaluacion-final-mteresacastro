// Importar y crear la conexion

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());


async function getConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
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

//Consultar todas las películas.
app.get("/moviesghibli", async (req, res) => {
  let query = "SELECT * FROM moviesghibli JOIN postersghibli ON moviesghibli.id = postersghibli.fk_movieposters;"

  const conn = await getConnection();

  const [results] = await conn.query(query);
  const numOfElements = results.length;

  res.json({
    success: true,
    info: { count: numOfElements },
    results: results
  });
});

//Obtener una pelicula por su ID.
app.get("/moviesghibli/:id", async (req, res) => {

  const idMovie = req.params.id;

  if (isNaN(parseInt(idMovie))) {
    res.json({
      success: false,
      error: "El id debe ser un número",
    });
    return;
  }

  let query = 'SELECT * FROM moviesghibli LEFT JOIN postersghibli ON moviesghibli.id = postersghibli.fk_movieposters WHERE moviesghibli.id = ?;';

  const conn = await getConnection();

  const [results] = await conn.query(query, [idMovie]);
  const numOfElements = results.length;

  if (numOfElements === 0) {
    res.json({
      success: true,
      message: "No existe la película de estudios ghibli que buscas en nuestros datos",
    });
    return;
  }

  res.json({
    success: true,
    results: results[0] 
  });
});

//Crear una nueva pelicula.
app.post("/moviesghibli", async (req, res) => {
  const dataMovie = req.body; 
  const { nombre, anio, director, descripcion } = dataMovie;
  const dataPoster = req.body;
  const {poster} = dataPoster;

  let sqlSelect = "SELECT * FROM moviesghibli WHERE nombre = ? AND anio = ? AND director = ? AND descripcion = ?;";

  const conn = await getConnection();

  const [results] = await conn.query(sqlSelect, [
    nombre,
    anio,
    director,
    descripcion
  ]);

  if (results.length > 0) {
    res.json({
      success: false,
      error: "La película ya existe en la base de datos",
    });
    return;
  }

  const currentYear = new Date().getFullYear(); //Para obtener el año actual y guardarlo en una variable

  if (isNaN(parseInt(anio)) || parseInt(anio) < 1900 || parseInt(anio) > currentYear) {
    res.json({
      success: false,
      error: "El año debe ser un número entero entre 1900 y " + currentYear,
    });
    return;
  }

  let sqlInsertMovie = "INSERT INTO moviesghibli (nombre, anio, director, descripcion) VALUES (?, ?, ?, ?);";
  let sqlInsertPoster = "INSERT INTO postersghibli (poster, fk_movieposters) VALUES (?, ?);";
 
  try {
    const conn = await getConnection();

    const [results] = await conn.query(sqlInsertMovie, [
      nombre,
      anio,
      director,
      descripcion
    ]);

    const [results2] = await conn.query(sqlInsertPoster, [
      poster,
      results.insertId
    ]);

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
      message: "La película se ha insertado correctamente"
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error${error}`,
    });
  }
});

//Actualizar datos de peliculas
app.put("/moviesghibli/:id", async (req, res) => {
  const dataMovie = req.body; 
  const { nombre, anio, director, descripcion } = dataMovie;
  const dataPoster = req.body;
  const {poster} = dataPoster;

  const idMovie = req.params.id;

  if (isNaN(parseInt(idMovie))) {
    res.json({
      success: false,
      error: "El id debe ser un número",
    });
    return;
  }

  let sqlSelectMovie = "SELECT * FROM moviesghibli WHERE id = ?;";

  const conn = await getConnection();

  const [resultsId] = await conn.query(sqlSelectMovie, [idMovie]);

  if (resultsId.length === 0) {
    res.json({
      success: false,
      error: "El id no existe en la base de datos",
    });
    return;
  }

  let sqlUpdate = "UPDATE moviesghibli JOIN postersghibli ON moviesghibli.id = postersghibli.fk_movieposters SET moviesghibli.nombre = ?, moviesghibli.anio = ?, moviesghibli.director = ?, moviesghibli.descripcion= ?, postersghibli.poster = ? WHERE id = ?;";
 
  const [results] = await conn.query(sqlUpdate, [
    nombre,
    anio,
    director,
    descripcion,
    poster,
    idMovie
  ]);

  res.json({
    success: true,
    message: "Datos actualizados correctamente"
  });
});

//Eliminar una pelicula
app.delete("/moviesghibli/:id", async (req, res) => {
  
  const idMovie = req.params.id;

  let sqlSelectMovie = "SELECT * FROM postersghibli WHERE postersghibli.fk_movieposters = ?;";
  let sqlSelectPoster = "SELECT * FROM moviesghibli WHERE moviesghibli.id = ?;"
  let sqlDeleteMovie = "DELETE FROM postersghibli WHERE postersghibli.fk_movieposters = ?;";
  let sqlDeletePoster = "DELETE FROM moviesghibli WHERE moviesghibli.id = ?;"

  const conn = await getConnection();

  const [results] = await conn.query(sqlSelectMovie, [idMovie]);
  const [results2] = await conn.query(sqlSelectPoster, [idMovie]);
  
  if (results.length === 0 || results2.length === 0) {
    res.json({
      success: false,
      error: "El id no existe en la base de datos",
    });
    return;
  }

  const deletedData = {
    movie: results2[0],
    poster: results[0]
  };

  await conn.query(sqlDeleteMovie, [idMovie]);
  await conn.query(sqlDeletePoster, [idMovie]);
  
  res.json({
    success: true,
    message: `Los siguientes datos se han borrado corretamente`,
    deletedData: deletedData
  });
});
