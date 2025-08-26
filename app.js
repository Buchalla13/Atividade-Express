const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

let tarefas = [
    { id: 1, titulo: "Exemplo de tarefa 1", feito: false },
    { id: 2, titulo: "Exemplo de tarefa 2", feito: true }
];
let proximoId = 3;

app.get('/tarefas', (req, res) => {
    const feito = req.query.feito;
    if (feito === 'true') {
        res.json(tarefas.filter(tarefa => tarefa.feito));
    } else if (feito === 'false') {
        res.json(tarefas.filter(tarefa => !tarefa.feito));
    } else {
        res.json(tarefas);
    }
});

app.post('/tarefas', (req, res) => {
    const novaTarefa = {
        id: proximoId++,
        titulo: req.body.titulo,
        feito: req.body.feito || false
    };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    tarefas[index] = {
        ...tarefas[index],
        titulo: req.body.titulo || tarefas[index].titulo,
        feito: req.body.feito !== undefined ? req.body.feito : tarefas[index].feito
    };

    res.json(tarefas[index]);
});

app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    tarefas = tarefas.filter(t => t.id !== id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
