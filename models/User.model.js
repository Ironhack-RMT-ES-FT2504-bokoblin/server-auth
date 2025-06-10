// ❗This is an example of a User Model. 
// TODO: Please make sure you edit the User model to whatever makes sense in your project.

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true, // esto no es validación, el sistema lo convierte en miniscula
      trim: true // esto no es validación, el sistema lo convierte removiendo los espacios vacios
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      enum: ["user", "admin"], // podríamos agregar otros roles
      default: "user" // asumimos que cualquier nuevo usuario será de este role
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
