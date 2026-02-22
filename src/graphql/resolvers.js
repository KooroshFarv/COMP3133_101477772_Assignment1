const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/User')
const { createToken } = require('./auth')


const resolvers = {
    Query : {
       login: async (_, {data}) => {
        const {usernameOrEmail, password} = data
        const user = await User.findOne({
            $or: [{username: usernameOrEmail} , {email: usernameOrEmail.toLowerCase()}]
        })

        if(!user) throw new Error('invalid credentials')



            const ok = await bcrypt.compare(password, user.password)

            if(!ok) throw new Error('invalid credentials')
                const token = createToken(user)

            return {
                message: 'login successful',
                token,
                user
            }
       }
    },


    Mutation: {
        signup: async (_, { data }) => {
            const {username, email, password} = data
            if(!validator.isEmail(email)) throw new Error('invalid email form')
            if(password.length < 8) throw new Error('password must be at least 8 characters')
                
            const exist = await User.findOne({
                $or: [{username}, {email:email.toLowerCase()}]
            })    

            if (exist) throw new Error('Username or Email already exists !')

            const hashed = await bcrypt.hash(password, 10)
            
            const user = await User.create({
                username,
                email: email.toLowerCase(),
                password: hashed
            })
            const token = createToken(user)

            const safeUser = {
                ...user.toObject(),
                created_at: new Date(user.created_at).toISOString(),
                updated_at: new Date(user.updated_at).toISOString()
                }

            return {
                message: 'signup successful',
                token,
                user: safeUser
            }
        }
    }
}

module.exports = {resolvers}