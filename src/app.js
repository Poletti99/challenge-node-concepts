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
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  const newRepository = {
    title: title || repositories[repoIndex].title,
    url: url || repositories[repoIndex].url,
    techs: techs || repositories[repoIndex].techs,
    id: repositories[repoIndex].id,
    likes: repositories[repoIndex].likes,
  };

  repositories.splice(repoIndex, 1, newRepository);
  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  repositories.splice(repoIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  const repository = repositories[repoIndex];
  const updatedRepository = {
    ...repository,
    likes: repository.likes + 1,
  };

  repositories.splice(repoIndex, 1, updatedRepository);

  return response.json(updatedRepository);
});

module.exports = app;
