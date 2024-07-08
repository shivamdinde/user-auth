const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

MONGODB_URI = 'mongodb+srv://purusotammishrasm:Cluster0@cluster0.dmfuytd.mongodb.net/User_Auth?retryWrites=true&w=majority&appName=Cluster0'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: async ({ req }) => {
  //   const token = req.headers.authorization || "";
  //   const user = await getUser(token);
  //   return { user }; // Ensure req is included in context
  // },
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    const { url } = await server.listen({ port: 5000 });
    console.log(`Server running at ${url}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

startServer();
