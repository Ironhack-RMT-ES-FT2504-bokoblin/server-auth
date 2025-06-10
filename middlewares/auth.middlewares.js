const jwt = require("jsonwebtoken")

// verifica que el token sea valido
function verifyToken(req, res, next) {

  console.log("ejecutando middleware")

  try {
    
    const tokenText = req.headers.authorization
    const token = tokenText.split(" ")[1]

    const payload = jwt.verify( token, process.env.TOKEN_SECRET )

    // si llegamos hasta este punto, significa que el token fue validado correctamente
    
    req.payload = payload // pasamos la info del usuario que hizo esta llamada a la ruta

    next() // continua con la ruta
  } catch (error) {
    res.status(401).json({errorMessage: "Token no existe o no es valido"})
  }

}

// verificar que el usuario sea admin
function verifyAdmin(req, res, next) {

  if (req.payload.role === "admin") {
    next() // continua con la ruta
  } else {
    res.status(401).json({errorMessage: "usuario no es admin"})
  }

}

module.exports = {
  verifyToken,
  verifyAdmin
}