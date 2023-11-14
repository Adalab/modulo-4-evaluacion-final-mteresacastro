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
  //creary configurar la conexion
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "recetas_db",
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
app.get("/recetas", async (req, res) => {
  //Select a la bases de datos
  let query = "SELECT * FROM recetas";

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
app.get("/recetas/:id", async (req, res) => {
  //Obtener el id: url params
  const idReceta = req.params.id;

  if (isNaN(parseInt(idReceta))) {
    res.json({
      success: false,
      error: "El id debe ser un número",
    });
    return;
  }

  //Select a la bases de datos con un id
  let query = "SELECT * FROM recetas WHERE id = ?";

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(query, [idReceta]);
  const numOfElements = results.length;

  if (numOfElements === 0) {
    res.json({
      success: true,
      message: "No existe la receta que buscas",
    });
    return;
  }

  //Enviar una respuesta
  res.json({
    results: results[0], // listado
  });
});

//Crear una nueva receta (POST /recetas)
app.post("/recetas", async (req, res) => {
  const dataReceta = req.body; //objeto
  const { nombre, ingredientes, instrucciones } = dataReceta;

  //Validaciones
  //Validar que viene el nombre, ingredientes y las instrucciones -- res.json(error)

  let sql =
    "INSERT INTO recetas(nombre, ingredientes, instrucciones) VALUES (?, ?, ?);";

  try {
    //hacer la conexión con la BD
    const conn = await getConnection();

    //Ejecutar esa consulta
    const [results] = await conn.query(sql, [
      nombre,
      ingredientes,
      instrucciones,
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
      id: results.insertId, // id que generó MySQL para la nueva fila
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
app.put("/recetas/:id", async (req, res) => {
  //Obtener los valores del req.body
  const dataReceta = req.body; //objeto
  const { nombre, ingredientes, instrucciones } = dataReceta;

  //Obtener el id del req.params
  const idReceta = req.params.id;

  //buscar si este id existe en mi bd

  let sql =
    "UPDATE recetas SET  nombre =? , ingredientes = ?, instrucciones =? WHERE id = ?";

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(sql, [
    nombre,
    ingredientes,
    instrucciones,
    idReceta,
  ]);

  res.json({
    success: true,
    message: "Actualizado correctamente",
  });
});

//Eliminar una receta (DELETE /recetas/:id)
//id: url params
app.delete("/recetas/:id", async (req, res) => {
  //Obtener el id del req.params
  const idReceta = req.params.id;

  //buscar si este id existe en mi bd
  //Puedo hacer un select a la BD si exste hago el delete
  //Sino existe envio una res.json(error)

  let sql = "DELETE FROM recetas WHERE id = ? ";

  //hacer la conexión con la BD
  const conn = await getConnection();

  //Ejecutar esa consulta
  const [results] = await conn.query(sql, [idReceta]);

  res.json({
    success: true,
    message: "Eliminado correctamente",
  });
});