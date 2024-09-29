const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema.js')
const resolvers = require('./db/resolvers.js');
const conectarDB = require('./config/db.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' })

conectarDB();

// Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';
        let usuario = null;
        if (token) {
            try {
                usuario = jwt.verify(token, process.env.SECRETA);
            } catch (error) {
                throw new Error('Token inválido');
            }
        }
        return { usuario };
    },
});

// Inicialiozar el serivodor
server.listen().then( ({url}) => {
    console.log(`Serviodr listo en ${url}`);
})