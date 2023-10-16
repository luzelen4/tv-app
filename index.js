const express = require('express');
const fs = require('fs');
const dataPath = 'tvs.json';

const app = express();
app.use(express.json());


// Ruta para obtener todos los tvs
app.get('/tvs', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'No se pudo obtener la lista de los tvs.' });
    }
    const tvs = JSON.parse(data);
    res.json(tvs);
  });
});

// Ruta para obtener un tv por id
app.get('/tvs/:tvId', (req, res) => {
  const tvId = parseInt(req.params.tvId);
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'No se pudo obtener la información del tv solicitado.' });
    }
    const tvs = JSON.parse(data);
    const tv = tvs.find((s) => s.id === tvId);
    if (!tv) {
      return res.status(400).json({ error: 'tv no encontrado.' });
    }
    res.json(tv);
  });
});

// Ruta para agregar un nuevo tv
app.post('/tvs', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'No se pudo agregar el tv.' });
    }
    const tvs = JSON.parse(data);
    const newTv = req.body;
    newTv.id = tvs.length + 1;
    tvs.push(newTv);

    fs.writeFile(dataPath, JSON.stringify(tvs, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'No se pudo agregar el tv.' });
      }
      res.status(201).json(newTv);
    });
  });
});

// Ruta para actualizar un tv por ID
app.put('/tvs/:tvId', (req, res) => {
  const tvIdId = parseInt(req.params.tvId);
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo actualizar la información del tv.' });
    }
    let tvs = JSON.parse(data);
    const updatedTv = req.body;
    tvs = tvs.map((tv) =>
      tv.id === tvId ? { ...tv, ...updatedTv } : tv
    );

    fs.writeFile(dataPath, JSON.stringify(tv, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'No se pudo actualizar la información del tv.' });
      }
      res.json(updatedTv);
    });
  });
});

// Ruta para eliminar un tv por ID
app.delete('/tvs/:tvId', (req, res) => {
  const tvId = parseInt(req.params.tvId);
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo eliminar el tv.' });
    }
    let tvs = JSON.parse(data);
    const index = tvs.findIndex((tv) => tv.id === tvId);
    if (index === -1) {
      return res.status(404).json({ error: 'tv no encontrado.' });
    }
    const deletedTv = tvs.splice(index, 1)[0];

    fs.writeFile(dataPath, JSON.stringify(tvs, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(400 ).json({ error: 'No se pudo eliminar el tv.' });
      }
      res.json(deletedTv);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
