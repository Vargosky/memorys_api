const express = require("express");
const cors = require("cors");
const connection = require("./database/connection");

const app = express();
const port = process.env.PORT || 3001;

// Middleware para configurar CORS
app.use(cors({
    origin: (origin, callback) => {
        // Permitir cualquier origen
        callback(null, true);
    },
    credentials: true,
}));

// Convertir todo a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas -MMPP y subproducto ->listay falta:produccion

const routeMateriaPrima = require("./api/routes/routeMateriaPrima");
const routeSubproducto = require("./api/routes/routeSubproducto");
const routeProduccion = require("./api/routes/routeProduccion");

app.use("/api/mmpp", routeMateriaPrima);  //ruta de materias primas listo fx
app.use("/api/subproducto",routeSubproducto);
app.use("/api/produccion",routeProduccion);



app.get("/", (req, res) => {
    res.send('Conectado de forma correcta');
});

// Middleware de errores (Agrega este después de todas tus rutas)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor y manejar la conexión con la BD
const initializeServer = async () => {
    try {
        await connection();
        console.log("Conexión exitosa a la base de datos.");
        app.listen(port, () => {
            console.log(`Servidor de Node corriendo en el puerto ${port}`);
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
    }
};

// Iniciar el servidor
initializeServer();

module.exports = app;
