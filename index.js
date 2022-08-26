const express = require('express')
const {Router} = express
const {engine} = require('express-handlebars')

const app = express()
const productos = Router()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// PRODUCTOS

const listaProductos = [{
        thumbnail:"https://www.gloriasaltos.com/wp-content/uploads/2020/04/126524.jpg",
        titulo: "Acondicionador",
        precio: "$270",
        id: 1
    },
    {
        thumbnail: "https://images.ctfassets.net/jdgtuh2uadx0/mQeFlcYhNAD5DfXNJ56lTY/40cbe23642e256d88dfa68339bea91c9/image-pdp-07500435125161_c1n1_la2018feb22125459-i5ckP-image",
        titulo: "Shampoo",
        precio: "$270",
        id: 2
    },
    {
        thumbnail:"https://dqm4sv5xk0oaj.cloudfront.net/products/5649/large/7891150025998.jpg?1548263621",
        titulo: "Jabon",
        precio: "$150",
        id: 3
    }
]


// GET

productos.get('/', (req, res) => {
    res.send('datos', listaProductos)
})


productos.get('/:id', (req, res) => {

    const id = req.params.id

    const productoBuscado = listaProductos.filter(producto => producto.id === id)

    if (listaProductos.length < id) {
        console.log("No se ha encontrado un producto con dicho ID")
    } else {
        res.send(productoBuscado)
    }

})


// POST

productos.post('/', (req, res, next) => {

    const {
        titulo,
        precio
    } = req.body

    if (!titulo || !precio) {
        res.status(400).send('producto no encontrado')
    }

    next()

}, (req, res) => {

    const {
        titulo,
        precio
    } = req.body

    listaProductos.push({
        titulo,
        precio
    })

    res.send('producto guardado con exito')
})

// PUT

productos.put('/:id', (req, res) => {

    const {
        titulo,
        price
    } = req.body;

    const index = listaProductos.filter(producto => producto.id === Number(req.params.id))

    if (index >= 0) {
        listaProductos[index] = {
            titulo,
            price
        };
        listaProductos[index].id = Number(req.params.id);
        res.send(console.log(listaProductos[index]));
    } else {
        res.status(404).send({
            error: 'Producto no encontrado'
        });
    }
});


// DELETE

productos.delete('/:id', (req, res) => {
    // Elimina un producto segun su id
    const id = req.params.id
    // filtrar los datos para identificar el objeto a eliminar y eliminarlo
    const productoBorrado = listaProductos.filter((elemento) => elemento.id !== id);
    if (productoBorrado.length == listaProductos.length) {
        console.log("No se encontro un item con dicho id para eliminar");
    } else {

        listaProductos.splice(productoBorrado, 1) // Elimina el primer elemento el array
        console.log(listaProductos)
        res.send("Elemento eliminado")
    }
})


app.get('/productos', (req, res) => {
    // render recibe la vista que se renderiza, y los datos que se renderizan en esa vista
    res.render('datos', {
        listaProductos: listaProductos,
        listExists: true
    })

})

app.use('/api/producto', productos)


const PORT = 8080
app.listen(PORT, () => {
    console.log('server on')
})