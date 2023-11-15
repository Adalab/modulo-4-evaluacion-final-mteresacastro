
# Documentación de la API de Estudios Ghibli

La API de Estudios Ghibli es una API RESTful que proporciona información sobre las películas de Estudios Ghibli. La API utiliza una base de datos MySQL con dos tablas: moviesghibli y postersghibli.

## Tabla ```moviesghibli```

La tabla moviesghibli contiene información sobre las películas de Estudios Ghibli. La tabla tiene las siguientes columnas:
- id: El ID de la película (INT).
- pelicula: El nombre de la película (VARCHAR).
- anio: El año de lanzamiento de la película (INT).
- director: El director de la película (VARCHAR).
- descripcion: Una breve descripción de la película (TEXT).

## Tabla ```postersghibli```

La tabla postersghibli contiene información sobre los carteles de las películas de Estudios Ghibli. La tabla tiene las siguientes columnas:
- idposter: El ID del cartel (INT)
- poster: La URL del cartel de la película (VARCHAR).
- fk_movieposters: Clave foránea, corresponde con el ID de la película a la que pertenece el cartel (INT).

## Endpoints

La API de Estudios Ghibli proporciona los siguientes endpoints:

### Consultar todas las películas

```GET /moviesghibli```

Este endpoint devuelve una lista de todas las películas de Estudios Ghibli en la base de datos. La respuesta JSON tiene el siguiente formato:

```{"info": { "count": 20}, "results": [{ "id": 1, "pelicula": "Mi vecino Totoro", "anio": 1988, "director": "Hayao Miyazaki", "descripcion": "Dos niñas se mudan al campo para estar cerca de su madre enferma y descubren criaturas mágicas en su jardín."}, {"id": 2, "pelicula": "La princesa Mononoke", "anio": 1997, "director": "Hayao Miyazaki", "descripcion": "En el Japón feudal, un joven guerrero lucha contra los humanos que destruyen la naturaleza."},...]}```


### Obtener una película por su ID

```GET /moviesghibli/:id```

Este endpoint devuelve una película de Estudios Ghibli por su ID. El ID de la película se especifica en la URL. Si la película no existe en la base de datos, se devuelve una respuesta JSON de error. La respuesta JSON tiene el siguiente formato:

```{success: true, results:{"id": 1,"pelicula": "Mi vecino Totoro","anio": 1988,"director": "Hayao Miyazaki","descripcion": "Dos niñas se mudan al campo para estar cerca de su madre enferma y descubren criaturas mágicas en su jardín.", "poster": "https://example.com/poster.jpg"}}```

### Insertar una nueva película

```POST /moviesghibli```

Este endpoint inserta una nueva película en la base de datos. Los datos de la película se especifican en el cuerpo de la solicitud como un objeto JSON. Si la película ya existe en la base de datos, se devuelve una respuesta JSON de error. La respuesta JSON tiene el siguiente formato:

```{success: true, idMovie: 14, idPoster: 15, message: "La película se ha insertado correctamente"}```

### Actualizar una película existente

```PUT /moviesghibli/:id```

Este endpoint actualiza una película existente en la base de datos. El ID de la película se especifica en la URL. Los datos actualizados de la película se especifican en el cuerpo de la solicitud como un objeto JSON. Si la película no existe en la base de datos, se devuelve una respuesta JSON de error. La respuesta JSON tiene el siguiente formato: 

```{ success: true, message: "Datos actualizados correctamente"}```

### Eliminar una película existente

```DELETE /moviesghibli/:id```

Este endpoint elimina una película existente de la base de datos. El ID de la película se especifica en la URL. Si la película no existe en la base de datos, se devuelve una respuesta JSON de error. La respuesta JSON tiene el siguiente formato:

```{"success":true,"message":"Los siguientes datos se han borrado corretamente","deletedData":{"movie":{"id":19,"nombre":"Haru en el reino de los gatos update33","anio":2002,"director":"Hiroyuki Morita","descripcion":"La historia si33gue a Haru, una joven que salva a un gato de ser atropellado por un camión. Resulta que el gato es Lune, el príncipe del Reino de los Gatos. En agradecimiento, Lune invita a Haru a pasar un tiempo en su reino. Sin embargo, cuando Haru llega al reino, descubre que está en peligro y que debe ayudar a Lune a salvarlo."},"poster":{"idposter":20,"poster":"https://images.ju33stwatch.com/poster/178789592/s592/haru-en-el-reino-de-los-gatos","fk_movieposters":19}}}```

## Autora

- [@mteresacastro](https://github.com/mteresacastro)

# Agradecimientos

Después de unos meses muy duros de trabajo, y de haber intentado dar lo mejor de mi, pese incluso a haber pasado una enfermedad en el camino, me llevo muchísimas cosas positivas, he crecido y evolucionado mucho como persona y como profesional, y he descubierto que cuando le pongo ganas, no hay límites, cansacio, ni muros infranqueables. 

Pero estas palabras de superación personal no habrían sido posibles sin vuestra ayuda, Yanelis, Dayana, Iván... Solo tengo palabras de agradecimiento. Vuestra labor es durísima, ya que la programación en sus comienzos es un camino árido y complicado, pero con vuestra paciencia y cariño conseguís que muchas mujeres llegadas de distintos ámbitos sean capacez de entenderlo todo, e incluso de engancharse a ello! 

Me alegra mucho haber podido conoceros y comenzar esta aventura bajo vuestra tutela, se que esto no termina aquí, y que todo lo aprendido y lo que seguiré aprendiendo será gracias a vuestro esfuerzo y buenhacer.  

Mil gracias profes, y...ya estaría! <3
