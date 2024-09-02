import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


//archivo html local
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/canciones', (req, res) => {
    const nuevaCanción = req.body;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        const canciones = JSON.parse(data);
        canciones.push(nuevaCanción);
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.status(201).send('Canción agregada exitosamente');
        });
    });
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const actualización = req.body;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        let canciones = JSON.parse(data);
        const index = canciones.findIndex(canción => canción.id === parseInt(id));
        if (index === -1) {
            res.status(404).send('Canción no encontrada');
            return;
        }
        canciones[index] = { ...canciones[index], ...actualización };
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.send('Canción actualizada exitosamente');
        });
    });
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        let canciones = JSON.parse(data);
        canciones = canciones.filter(canción => canción.id !== parseInt(id));
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.send('Canción eliminada exitosamente');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
