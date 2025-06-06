const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User.model");
const verifyToken = require("../middlewares/auth.middlewares");

// POST "/api/auth/signup" => Ruta para registrar un usuario
router.post("/signup", async(req, res, next) => {

  console.log(req.body)

  // recibir la data del usuario
  const { username, email, password } = req.body

  // 1. que todos los campos existan y tengan valores
  if (!username || !email || !password) {
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios (username, email, password)" })
    return; // detener la ejecución de la ruta
  }

  // 2. (opcional) que los valores tengan el tipo de data correcto

  // 3. validaciones de la contraseña
  let regexPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
  if (regexPassword.test(password) === false) {
    res.status(400).json({ errorMessage: "La contraseña no es valida. Debe contener al menos una letra, un numero, un caracter especial y tener entre 8 y 16 caracteres." })
    return;
  }

  try {
    // 4. Que el email sea unico
    const foundUser = await User.findOne( { email: email } )
    // console.log(foundUser)
    if (foundUser !== null) {
      res.status(400).json({ errorMessage: "Ya existe un usuario con ese correo electronico" })
      return;
    }

    // 5. (opcional) Que el username sea unico (si aplica

    // Cifrado de la contraseña
    const hashPassword = await bcrypt.hash( password, 12 )

    // crear el documento en la base de datos
    await User.create({
      username,
      email,
      password: hashPassword
    })

    res.sendStatus(201)
    
  } catch (error) {
    console.log(error)
  }
})

// POST "/api/auth/login" => Validar las credenciales del usuario (autenticarlo) y entregarle el Token
router.post("/login", async (req, res, next) => {

  console.log(req.body)
  const { email, password } = req.body

  // 1. validar que recibimos los campos
  if (!email || !password) {
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios (email, password)" })
    return;
  }

  try {
    // 2. Validar que el usuario existe
    const foundUser = await User.findOne( { email: email } )
    console.log(foundUser)
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "Usuario no registrado" })
      return;
    }

    // 3. Validar que la contraseña es correcta
    const isPasswordCorrect = await bcrypt.compare( password, foundUser.password )
    if (isPasswordCorrect === false) {
      res.status(400).json({ errorMessage: "La contraseña no es válida" })
      return;
    }

    // en este momento hemos terminado la autenticación. El usuario es quien dice ser.
    // Aqui vamos a crear esa llave virtual (Token) y lo entregamos al cliente.
    const payload = {
      _id: foundUser._id, // requerido
      email: foundUser.email, // opcional
      // si tuvieramos roles, estarian aqui.
    }

    const authToken = jwt.sign( payload, process.env.TOKEN_SECRET, { 
      algorithm: "HS256",
      expiresIn: "7d"
     } )

    res.status(200).json( { authToken } )

  } catch (error) {
    console.log(error)
  }

})

// GET "/api/auth/verify" => Validar el token (luego de generarlo y cuando el usuario vuelva a la app luego)
router.get("/verify", verifyToken, (req, res) => {
  res.json({ payload: req.payload })
})


module.exports = router