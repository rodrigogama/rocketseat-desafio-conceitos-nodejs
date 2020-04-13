const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title = '', url = '', techs = [] } = request.body;
  const newProject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newProject);
  return response.status(200).json(newProject);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repository = repositories.find(r => r.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  // preserve old properties if they're not provided, e.g: user wants to update only the title.
  repository.title = title || repository.title;
  repository.url = url || repository.url;
  repository.techs = techs || repository.techs;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(r => r.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
