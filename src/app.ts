import express, { Request, Response } from "express";

const fileService = exports("./file.service");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req: Request, res: Response) => {
  const users = await fileService.readDB();
  res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, age, gender } = req.body;
  if (!name) {
    return res.status(400).json("name is wrong");
  }
  if (!age || age < 0 || age > 100) {
    return res.status(400).json("age is wrong");
  }
  if (!gender || (gender !== "male" && "female")) {
    return res.status(400).json("gender not valid");
  }

  const users = await fileService.readDB();

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    age,
    gender,
  };
  users.push(newUser);
  await fileService.writeDB(users);

  res.status(201).json(newUser);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const users = await fileService.readDB();

  const user = users.find((user) => user.id === +id);
  if (!user) {
    return res.status(422).json("User not found");
  }
  res.json(user);
});

app.patch("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, gender } = req.body;

  if (name && name.length < 3) {
    return res.status(400).json("name is wrong");
  }
  if (age && (age < 0 || age > 100)) {
    return res.status(400).json("age is wrong");
  }
  if (gender && gender !== "male" && "female") {
    return res.status(400).json("gender not valid");
  }

  const users = await fileService.readDB();
  const user = users.find((user) => user.id === +id);

  if (!user) {
    return res.status(422).json("user not found");
  }
  if (name) user.name = name;
  if (age) user.age = age;
  if (gender) user.gender = gender;

  await fileService.writeDB(users);
  res.status(201).json(user);
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const users = await fileService.readDB();
  const index = users.findIndex((user) => user.id === +id);

  if (index === -1) {
    return res.status(422).json("user not found");
  }
  users.splice(index, 1);
  await fileService.writeDB(users);
  res.sendStatus(204);
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server has started  on port ${PORT}🤞`);
});
