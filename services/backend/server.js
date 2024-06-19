const { Client } = require("pg");
const express = require("express");
const Keycloak = require("keycloak-connect");

const keycloak = new Keycloak({}, "backend.json");
const app = express();
const port = 3000;
app.use(express.json());
const routes = express.Router();
app.use("/api", routes);

const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});
keycloak.redirectToLogin = (req) => false;
keycloak.accessDenied = (req, res) => {
  res.status(401).json({ message: "You're not logged in" });
};
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    const query = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `;
    client.query(query);
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

routes.get("/todo", keycloak.protect(), async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos");
    res.status(200).json({ todos: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

routes.post("/todo", keycloak.protect(), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "No title given" });
    }
    const result = await client.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

routes.delete("/todo", keycloak.protect(), async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "No id given" });
    }
    const result = await client.query("DELETE FROM todos WHERE id = $1", [id]);
    res.status(201).json({ message: "succesfully removed item" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
