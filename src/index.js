require('dotenv').config()
const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const {connectDB} = require('./config/db')
const {typeDefs} = require('./graphql/typeDefs')
const{resolvers} = require('./graphql/resolvers')


async function startServer() {
    const app = express()
    app.use(express.json())
    await connectDB()
    const server = new ApolloServer({
        typeDefs,
        resolvers
    })

    await server.start()
    server.applyMiddleware({app, path: '/graphql'})




    app.get('/', (req,res) => {
    res.json({message: 'employee management running'})
})

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
    console.log(`server running ${PORT}`)

})
}
startServer()


