const { gql } = require('apollo-server');

const typeDefs = gql`

    type Usuario {
        id:ID
        nombre:String
        apellido:String
        email:String
        create:String 
    }

    type Producto {
        id: ID,
        nombre: String,
        existencia: Int,
        precio: Float,
        create: String
    }

    type Cliente {
        id: ID,
        nombre: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }

    input UsuarioInput {
        nombre:String!
        apellido:String!
        email:String!
        password:String!
    }

    input AutenticarInput{
        email:String!
        password:String!
    }

    input ProductoInput{
        nombre:String!
        existencia:Int!,
        precio:Float!
    }

    input ClienteInput{
        nombre: String!
        apellidos: String!
        empresa: String!
        email: String!
        telefono: String
    }

    type Token {
        token:String
    }

    type Query {
        obtenerUsuario(token:String!) : Usuario
        obtenerProductos : [Producto]
        obtenerProducto(id:ID!) : Producto
        obtenerClientes : [Cliente]
        obtenerClientesVendedor : [Cliente]
    }

    type Mensaje {
        status:Int!
        mensaje:String!
    }

    type Mutation {
        #Usuarios
        nuevoUsuario(input:UsuarioInput): Usuario
        autenticarUsuario(input:AutenticarInput): Token

        #Productos
        nuevoProducto(input:ProductoInput): Producto
        actualizarProducto(id:ID!,input:ProductoInput): Producto
        eliminarProducto(id:ID!): Mensaje
    
        #Clientes
        nuevoCliente(input:ClienteInput) : Cliente
        eliminarCliente(id:ID):Mensaje
        obtenerClientesVendedor(id:ID!):[Cliente]
    }

`;

module.exports = typeDefs;