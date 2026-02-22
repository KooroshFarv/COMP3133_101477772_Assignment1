require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { connectDB } = require("./config/db");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const { getUserFromToken } = require("./graphql/context");

async function startServer() {
  const app = express();
  app.use(express.json());

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromToken(req);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.get("/", (req, res) => {
    res.json({ message: "employee management running" });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`server running ${PORT}`));
}

startServer();