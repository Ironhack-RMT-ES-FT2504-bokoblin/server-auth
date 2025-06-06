const express = require("express");
const router = express.Router();

// ℹ️ Test Route. Can be left and used for waking up the server if idle
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)


const verifyToken = require("../middlewares/auth.middlewares")
// EJEMPLO DE RUTA PRIVADA (NO DEBEMOS TENERLA EN PROYECTO)
router.get("/ejemplo-ruta-privada", verifyToken, (req, res, next) => {

  console.log(req.payload) //! ESTA ES LA FORMA EN LA QUE EL BACKEND SABE QUIEN ESTÁ HACIENDO LAS LLAMADAS. ES NECESARIOS PARA CUALQUIER TIPO DE FUNCIONALIDAD PRIVADA.

  // aqui cualquier acceso a la base de datos que queramos que sea privado (acceder a data privada, crear un documento, editar un documento, etc...)

  res.send("Aqui tienes esta información es que es privada solo para usuario logeados")
})


module.exports = router;

// router.post("/receta", async(req, res, next) => {

//   const { nombreReceta, calories, ingredientes } = req.body

//   Receta.create({
//     nombreReceta: nombreReceta,
//     calories: calories,
//     ingredientes: ingredientes,
//     creador: req.payload._id
//   })

// })