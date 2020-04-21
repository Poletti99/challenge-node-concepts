const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", checkIsValidId);

const repositories = [];

function checkIsValidId(request, response, next) {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (!isUuid(id) || repoIndex < 0) {
    return response.status(400).json({ error: "Não é um id valido" });
  }

  request.repositoryIndex = repoIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const data = request.body;
  const newRepository = {
    ...data,
    id: uuid(),
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;
  const { title, url, techs } = request.body;

  const newRepository = {
    title: title || repositories[repositoryIndex].title,
    url: url || repositories[repositoryIndex].url,
    techs: techs || repositories[repositoryIndex].techs,
    id: repositories[repositoryIndex].id,
    likes: repositories[repositoryIndex].likes,
  };

  repositories.splice(repositoryIndex, 1, newRepository);
  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request;
  const repository = repositories[repositoryIndex];
  const updatedRepository = {
    ...repository,
    likes: repository.likes + 1,
  };

  repositories.splice(repositoryIndex, 1, updatedRepository);

  return response.json(updatedRepository);
});

module.exports = app;
