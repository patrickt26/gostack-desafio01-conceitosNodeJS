const express = require('express');

const server = express();
server.use(express.json());
//localhost:3001/projects

//variavel com projetos já pré definidos
const projects = [
  { 
    id: "0",
    title: "NodeJS",
    task: [
      "Conceitos NodeJS",
      "Desenvolvimento"
    ]
  },{
    id: "1",
    title: "Reqct Native",
    task: []
  }
];
let numRequests = 0;

//Middleware para checar se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Projeto não encontrado' });
  }

  return next();
}

//Middleware que conta o número de requisições
function logRequests(req, res, next) {
  numRequests++;

  console.log(`Número de requisições: ${numRequests}`);

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => { //lista todos os projetos
  return res.json(projects);
});

server.post('/projects', (req, res) => { //cria um projeto novo
  const project = req.body;

  projects.push(project);

  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => { //altera o title do projeto
  const { title } = req.body;
  const { id } = req.params;

  projects[id].title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => { //deleta o projeto
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send('Projeto deletado');
});

server.post('/projects/:id/task', checkProjectExists, (req, res) => { //criar task
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.task.push(title);

  return res.json(projects);
});

server.listen(3001);