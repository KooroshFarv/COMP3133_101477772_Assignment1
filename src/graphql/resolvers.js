const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");
const Employee = require("../models/Employee");

const { createToken } = require("./auth");
const cloudinary = require("../config/cloudinary");

const requireAuth = (user) => {
  if (!user) throw new Error("Unauthorized");
};

const uploadIfBase64Image = async (maybeBase64) => {
  if (!maybeBase64) return null;

  if (!maybeBase64.startsWith("data:image")) return maybeBase64;

  try {
    const result = await cloudinary.uploader.upload(maybeBase64, {
      folder: "comp3133_employees",
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }
};

const resolvers = {
  Query: {
    login: async (_, { data }) => {
      const { usernameOrEmail, password } = data;

      const user = await User.findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail.toLowerCase() },
        ],
      });

      if (!user) throw new Error("invalid credentials");

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error("invalid credentials");

      const token = createToken(user);

      return { message: "login successful", token, user };
    },

    getAllEmployees: async (_, __, context) => {
      requireAuth(context.user);
      return Employee.find().sort({ created_at: -1 });
    },

    getEmployeeById: async (_, { id }, context) => {
      requireAuth(context.user);
      return Employee.findById(id);
    },

    searchEmployeesByDesignationOrDepartment: async (
      _,
      { designation, department },
      context
    ) => {
      requireAuth(context.user);

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;


      if (!designation && !department) return [];

      return Employee.find(filter).sort({ created_at: -1 });
    },
  },

  Mutation: {
    signup: async (_, { data }) => {
      const { username, email, password } = data;

      if (!validator.isEmail(email)) throw new Error("invalid email format");
      if (password.length < 8)
        throw new Error("password must be at least 8 characters");

      const exist = await User.findOne({
        $or: [{ username }, { email: email.toLowerCase() }],
      });

      if (exist) throw new Error("Username or Email already exists!");

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashed,
      });

      const token = createToken(user);

      const safeUser = {
        ...user.toObject(),
        created_at: new Date(user.created_at).toISOString(),
        updated_at: new Date(user.updated_at).toISOString(),
      };

      return { message: "signup successful", token, user: safeUser };
    },


    uploadEmployeePhoto: async (_, { base64 }, context) => {
      requireAuth(context.user);

      try {
        const result = await cloudinary.uploader.upload(base64, {
          folder: "comp3133_employees",
          resource_type: "image",
        });

        return {
          message: "Photo uploaded successfully",
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (err) {
        throw new Error("Cloudinary upload failed");
      }
    },

    addEmployee: async (_, { data }, context) => {
      requireAuth(context.user);

      if (!validator.isEmail(data.email)) throw new Error("Invalid email");

      const email = data.email.toLowerCase();

      const exist = await Employee.findOne({ email });
      if (exist) throw new Error("Employee email already exists");

      const photoUrl = await uploadIfBase64Image(data.employee_photo);

      return Employee.create({
        ...data,
        email,
        employee_photo: photoUrl,
      });
    },

    updateEmployee: async (_, { id, data }, context) => {
      requireAuth(context.user);

      if (data.email) {
        if (!validator.isEmail(data.email)) throw new Error("Invalid email");
        data.email = data.email.toLowerCase();

        const conflict = await Employee.findOne({
          email: data.email,
          _id: { $ne: id },
        });
        if (conflict) throw new Error("Employee email already exists");
      }

      if (data.employee_photo) {
        data.employee_photo = await uploadIfBase64Image(data.employee_photo);
      }

      const updated = await Employee.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) throw new Error("Employee not found");
      return updated;
    },

    deleteEmployee: async (_, { id }, context) => {
      requireAuth(context.user);

      const deleted = await Employee.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};

module.exports = { resolvers };