const {
    BAD_REQUEST
} = require('../helpers/error')
const _ = require('lodash');
const {
    ProductService
} = require('../services');
const { faker } = require('@faker-js/faker');
const fetch = require('node-fetch');

faker.locale = 'es';
class ProductController {

    static async getAll(req, res) {
        try {
            let response = await ProductService.getAll();
            res.send(response);
        } catch (error) {
            return [];
        }
    }

    static async prueba(req, res) {
        console.log("entro")
        ProductService.getAll();
    }
    static async getByIdOrAll(req, res) {
        try {
            let response;

            if (_.isNil(req.params.id)) {
                response = await ProductService.getAll();
            } else {
                response = await ProductService.getById(req.params.id);
            }

            res.send(response);
        } catch (error) {
            console.log("Algo salio mal al obtener los productos : " + error.message);
        }
    }

    static async addProduct(req, res) {
        try {
            let response = await ProductService.addProduct(req.body);
            res.send(response);
        } catch (error) {
            console.log("Algo salio mal al agregar los productos : " + error.message);
        }
    }

    static async updateProduct(req, res) {
        try {
            let response = await ProductService.updateProduct(req.body, req.params.id);
            res.send(response);
        } catch (error) {
            console.log("Algo salio mal al obtener los productos : " + error.message);
        }
    }

    static async deleteProduct(req, res) {
        try {
            let response = await ProductService.deleteProduct(req.params.id);
            res.send(response);
        } catch (error) {
            console.log("Algo salio mal al obtener los productos : " + error.message);
        }
    }


    /// Funciones del desafio

    static async productosGetTest(req, res) {
        try {
            const output = [];
            for (let i = 0; i < 5; i++) {

                output.push({
                    'nombre': faker.commerce.product(),
                    'precio': faker.commerce.price(),
                    'foto': faker.image.technics(240, 240, true)
                });
            }
            res.status(200).json(output);
        } catch (error) {
            console.log(error.message);
        }
    }

    static async productosGetTestView (req, res) {
        try {
            fetch('http://localhost:4000/api/product/')
            .then(response => response.json())
            .then(items => {
                res.render('tabla.hbs',{items})
            })
        } catch (error) {
            console.log(error.message);
        }
    }    
}

module.exports = ProductController;