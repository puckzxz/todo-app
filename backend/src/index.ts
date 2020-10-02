import "reflect-metadata";
import express from "express";
import { createConnection, getConnection } from "typeorm";
import cors from "cors";
import { Todo } from "./entity/Todo";

const app = express();

app.use(cors());

app.use(express.json());

const port = 3001;

createConnection().catch((err) => {
  throw new Error(err);
});

app.get("/todo", async (req, res) => {
  const todos = await getConnection().getRepository(Todo).find();
  if (todos.length === 0) {
    return res.sendStatus(204);
  }
  return res.status(200).send(todos);
});

app.post("/todo", async (req, res) => {
  const { title, description } = req.body as { title: string; description: string };

  if (!title || !description) {
    return res.sendStatus(400);
  }

  if (title.length > 128 || description.length > 256) {
    return res.sendStatus(413);
  }

  const todo = new Todo();

  todo.title = title;
  todo.description = description;

  const ok = await getConnection().getRepository(Todo).save(todo);

  if (!ok) {
    return res.sendStatus(500);
  }

  return res.status(200).send(ok);
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  const parsedID = parseInt(id, 10);

  const todo = await getConnection().getRepository(Todo).findOne({id: parsedID});

  if (!todo) {
    return res.sendStatus(404);
  }

  const ok = await getConnection().getRepository(Todo).delete(todo);

  if (!ok) {
    return res.sendStatus(500);
  }

  return res.sendStatus(200);
});

app.patch("/todo/:id", async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  const { title, description } = req.body as { title: string; description: string };

  if (!title || !description) {
    return res.sendStatus(400);
  }

  if (title.length > 128 || description.length > 256) {
    return res.sendStatus(413);
  }

  const parsedID = parseInt(id, 10);

  const todo = await getConnection().getRepository(Todo).findOne({id: parsedID});

  if (!todo) {
    return res.sendStatus(404);
  }

  todo.title = title;
  todo.description = description;

  const ok = await getConnection().getRepository(Todo).save(todo);

  if (!ok) {
    return res.sendStatus(500);
  }

  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
