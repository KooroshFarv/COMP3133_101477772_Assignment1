const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Invalid Email",
      },
    },

    gender: { type: String, required: true,
        enum: ['Male', 'Female', 'Other']
     }, 
    salary: { type: Number, 
        required: true, 
        min: 1000 
    },
    date_of_joining: {
        type: Date,
        required: true
    },


    department: { type: String, required: true ,trim: true },
    designation: { type: String, required: true ,trim: true },

    employee_photo: {
         type: String, 
         trim: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Employee", employeeSchema);