//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

    //Insertar bitácora al listar
    const moment = require('moment')
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const log = JSON.parse(fs.readFileSync('access_log.json', 'utf8'))

 //Modulos internas
 const { readFile, writeFile } = require('./src/files');

 const app = express();
 const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
 const FILE_NAME = './db/tvs.json'; // cambio

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') //DEBEMOS CREAR LA CARPETA

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

//WEB LISTAR TVS
app.get('/tvs', (req, res) =>{
    const data = readFile(FILE_NAME);
    res.render('tvs/index', {tvs : data});

    log.insert_request_dates.push(
        new_record = {"date": time})
        fs.writeFileSync('access_log.json', JSON.stringify(log))
})

//WEB CREAR TVS
app.get('/tvs/create', (req,res) =>{
    //Mostrar el formulario
    res.render('tvs/create');
})

app.post('/tvs', (req,res) =>{
    try{
        //Leer el archivo de tvs
        const data = readFile(FILE_NAME);
    
        //Agregar el nuevo registro
        const newTv = req.body;
        newTv.id = uuidv4();
        console.log(newTv)
        data.push(newTv); //agrego nuevo elemento

        //Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.redirect('/tvs')
    }catch (error){
            console.error(error);
            res.json({message: ' Error al almacenar el tv'});
        }
})

//WEB ELIMINAR TVS
app.post('/tvs/Delete/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const cars = readFile(FILE_NAME)

    //BUSCAR EL TV CON EL ID QUE RECIBE
    const tvIndex = tvs.findIndex(tv => tv.id === id)
    if(tvIndex < 0){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }
    //eliminar el tv en la posicion
    tvs.splice(tvIndex,1);
    writeFile(FILE_NAME, tvs)
    res.redirect('/tvs');
})


//API
//Listar tvs
app.get('/api/tvs', (req,res) =>{
    const data = readFile(FILE_NAME);
    res.json(data);
})


//Crear tvs
app.post('/api/tvs', (req, res) => {
    try{
    //Leer el archivo de mascotas
    const data = readFile(FILE_NAME);

    //Agregar el nuevo carro
    const newTv = req.body;
    newTv.id = uuidv4();
    console.log(newTv)
    data.push(newTv); //agrego nuevo elemento

    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'El tv fue creado'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar el tv'});
    }

});

//Obtener un solo tv (usamos los dos puntos por que es un path param)
app.get('/api/tvs/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR TV CON EL ID QUE RECIBE
    const petFound = pets.find(tv => tv.id === id)
    if(!petFound){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }

    res.json({'ok': true, pet: petFound});
})
//ACTUALIZAR UN DATO
app.put('/api/tvs/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR TV CON EL ID QUE RECIBE
    const petIndex = pets.findIndex(pet => pet.id === id)
    if(tvIndex < 0){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }
    let tv = tvs[petIndex]; //sacar del arreglo
    tv={...tv, ...req.body}
    tvs[petIndex] = tv //Poner la mascota en el mismo lugar
    writeFile(FILE_NAME, pets);
    //SI LA MASCOTA EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE


    res.json({'ok': true, tv: tv});
})

//Delete, eliminar un dato
app.delete('/api/tvs/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const tvs = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const tvIndex = tvs.findIndex(tv => tv.id === id)
    if(tvIndex < 0){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }
    //eliminar la mascota en la posicion
    tvs.splice(tvIndex,1);
    writeFile(FILE_NAME, pets)
    res.json({'ok': true});
})

app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});