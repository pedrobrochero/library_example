# Library

Esta es una API que maneja una collecion de libros. Estos pueden ser prestados/devueltos por los usuarios. 

### Instalaciones requeridas

* NodeJS 
* Postgres

### Instalación

Se requiere la creacion manual de una base de datos de nombre:
```
library
```

Verificar las credenciales de la base de datos en 
```
lib/db/index
```

Para servidor de produccion habilitar la linea destinada para ello en:
```
lib/config
```

Finalmente, instalar dependencias, transpilar desde Typescript y ejecutar:
```
npm install
npx tsc
npm start
```

## Endpoints

### Libros
* post('/book')
* get('/book/:id')
* put('/book/:id')
* delete('/book/:id')
* get('/book/search/:query')
* put('/book/lend/:id')
* put('/book/return/:id')

### Personas
* post('/persona')
* get('/persona/:id')
* put('/persona/:id')
* delete('/persona/:id')
* get('/persona/search/:query')

### Historial
* get('/history/:page')
* get('/history/persona/:id')
* get('/history/book/:id')

---