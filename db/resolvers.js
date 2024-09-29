const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Producto = require('../models/Productos')
const Cliente = require('../models/Clientes')
dotenv.config({ path: 'variables.env' })

const crearToken = (usuario, secreta, expiresIn) => {
    const { id, email, nombre, apellido } = usuario;
    return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn })
}

const authMiddleware = (resolver) => {
    return (parent, args, context, info) => {
        if (!context.usuario) {
            throw new Error('No autenticado');
        }
        return resolver(parent, args, context, info);
    };
};


const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }) => {
            const usuarioId = jwt.verify(token, process.env.SECRETA);
            return usuarioId
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find();
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, { id }) => {
            try {
                const producto = await Producto.findById(id);
                if (!producto) {
                    throw new Error('El producto no existe');
                }
                return producto;
            } catch (error) {
                throw new Error('Ha ocurrido un error al obtener el producto');
            }
        },
        obtenerClientes: async () => {
            const clientes = await Cliente.find();
            return clientes
        },
        obtenerClientesVendedor: authMiddleware(async (_, { }, ctx) => {
            try {
                const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() })
                return clientes
            } catch (error) {
                throw new Error('Ha ocurrido un error al obtener el producto');
            }
        })
    },
    Mutation: {
        nuevoUsuario: async (_, { input }, ctx) => {
            const { email, password } = input;
            // validar usuario
            const existeUsuario = await Usuario.findOne({ email });
            if (existeUsuario) {
                throw new Error('El usuario  ya esta registrado')
            }
            // Hasear password
            const salt = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);
            // Guardar usuarios
            try {
                const usuario = new Usuario(input);
                usuario.save();
                return usuario
            } catch (error) {
                console.log(erorr);
            }
            return 'Crenado...'
        },
        autenticarUsuario: async (_, { input }) => {
            const { password, email } = input;
            const existeUsuario = await Usuario.findOne({ email });
            if (!existeUsuario) throw new Error('El usuario no existe');
            // Revisar password correcto
            const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);
            if (!passwordCorrecto) throw new Error('El password es incorrecto');
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },
        nuevoProducto: authMiddleware(async (_, { input }) => {
            try {
                const nuevoProducto = await new Producto(input);
                await nuevoProducto.save();
                return nuevoProducto;
            } catch (error) {
                console.log(error);
                throw new Error('Ha ocurrido un error al creal el producto');
            }
        }),
        actualizarProducto: authMiddleware(async (_, { id, input }) => {
            try {
                // Revisar que el producto exsite
                let producto = await Producto.findById(id);
                if (!producto) {
                    throw new Error('El producto no existe');
                }
                // Guardarlo en la base de datos
                producto = await Producto.findByIdAndUpdate({ _id: id }, input, { new: true })
                return producto
            } catch (error) {
                console.log(error);
            }
        }),
        eliminarProducto: authMiddleware(async (_, { id }) => {
            try {

                // Revisar que el producto exsite
                let producto = await Producto.findById(id);
                if (!producto) {
                    throw new Error('El producto no existe');
                }

                await Producto.findByIdAndDelete(id);

                return {
                    mensaje: 'Producto eliminado correctamente',
                    status: 100
                }

            } catch (error) {
                return {
                    mensaje: error.toString(),
                    status: 100
                }
            }
        }),
        nuevoCliente: authMiddleware(async (_, { input }, ctx) => {

            try {

                const { email } = input;
                const { id } = ctx;

                console.log(ctx);

                // Verificar que el cliente no exista
                const cliente = await Cliente.findOne({ email });

                if (cliente) {
                    throw new Error('Este cliente ya nesta registerado')
                }

                let nuevoCiente = input;
                nuevoCiente.vendedor = id;

                console.log(nuevoCiente);

                const clienteSave = new Cliente(nuevoCiente);
                await clienteSave.save();
                return clienteSave;

            } catch (error) {
                throw new Error(error)
            }

        }),
        eliminarCliente: authMiddleware(async (_, { id }) => {
            try {

                await Cliente.findByIdAndDelete({ _id: id });
                return {
                    status: 200,
                    mensaje: 'Cliente eliminado correctamente'
                }

            } catch (error) {
                throw new Error(error);
            }
        })
    }
}

module.exports = resolvers;