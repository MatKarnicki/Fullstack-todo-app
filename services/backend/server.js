const { Client } = require("pg");
const express = require("express");
var jwtmod = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 3001;
const routes = express.Router();

const allowedOrigins = "*";
app.use(
  cors({
    origin: allowedOrigins,
    preflightContinue: true,
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: allowedOrigins,
    preflightContinue: true,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routes);
// const client = new Client({
//   user: "admin",
//   password: "password",
//   host: "localhost",
//   port: 5432,
//   database: "todos",
// });
const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    const query = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `;
    client.query(query);
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

routes.get("/todo", async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (
      authorization == undefined ||
      authorization == null ||
      authorization == ""
    ) {
      res.status(401);
    }
    const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    decodedToken = jwtmod.verify(authorization, public_key, {
      algorithms: ["RS256"],
    });
    try {
      const result = await client.query(
        `SELECT * FROM todos WHERE username='${decodedToken.email}'`
      );
      res.status(200).json({ todos: result.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch {
    res.status(401);
  }
});

routes.post("/todo", async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (
      authorization == undefined ||
      authorization == null ||
      authorization == ""
    ) {
      res.status(401);
    }
    const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    decodedToken = jwtmod.verify(authorization, public_key, {
      algorithms: ["RS256"],
    });
    try {
      const { title, date } = req.body;
      if (!title) {
        return res.status(400).json({ error: "No title given" });
      }
      const result = await client.query(
        "INSERT INTO todos (username, title, date) VALUES ($1, $2, $3) RETURNING *",
        [decodedToken.email, title, date]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch {
    res.status(401);
  }
});

routes.delete("/todo", async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (
      authorization == undefined ||
      authorization == null ||
      authorization == ""
    ) {
      res.status(401);
    }
    const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    decodedToken = jwtmod.verify(authorization, public_key, {
      algorithms: ["RS256"],
    });
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "No id given" });
      }
      const result = await client.query(
        "DELETE FROM todos WHERE id = $1 AND username = $2",
        [id, decodedToken.email]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch {
    res.status(401);
  }
});

routes.put("/todo", async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (
      authorization == undefined ||
      authorization == null ||
      authorization == ""
    ) {
      res.status(401);
    }
    const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    decodedToken = jwtmod.verify(authorization, public_key, {
      algorithms: ["RS256"],
    });
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "No id given" });
      }
      const result = await client.query(
        "UPDATE todos SET completed = true WHERE id = $1 AND username = $2",
        [id, decodedToken.email]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch {
    res.status(401);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
