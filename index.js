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
    context: ({req}) => {

        const token = req.headers['authorization'] || '';
        
        if(token){
            try {
                const usuario = jwt.verify(token,process.env.secreta)
                return usuario
            } catch (error) {
                console.log('Hubo un error');
                throw new Error(error);
            }            
        }
    }
});

// Inicialiozar el serivodor
server.listen().then( ({url}) => {
    console.log(`Serviodr listo en ${url}`);
})