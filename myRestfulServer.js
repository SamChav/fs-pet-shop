import express, { application } from "express";
import { readPetsFile } from "./shared.js";
import fs from "fs";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
app.use(express.json());

const pool = new pg.Pool({      
      database: 'samchav',
      password: 'oppji',
    });


//try using destructuring
app.post("/pets", async (req, res) => {
  try {
    const { name, kind, age } = req.body;
    pool
      .query(
        "INSERT INTO pets (name, age, kind) VALUES ($1, $2, $3) RETURNING *",
        [name, age, kind]
      )
      .then((data) => {
        res.send(data.rows);
      });
  } catch (error) {
    console.error(error.message);
    res.status(404).type("application/json");
  }
});




app.get("/pets", async (req, res) => {
  try {
    await pool
    .query(`SELECT * FROM pets ORDER BY id ASC;`)
    .then((data) => {
      res.send(data.rows);
    });
  } catch (error) {
    console.error(error.message);
  }
});



app.get("/pets/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  
  try {
    await pool
    .query(`SELECT * FROM pets WHERE id = $1;`, [id])
    .then((data) => { 
       
        if (data.rows.length === 0) {
            res.sendStatus(404);
        } else {                   
            res.send(data.rows).type('application/json');
        }
    });
  } catch (error) {
    console.error(error.message);
  }
});



app.patch("/pets/:id", async (req, res) => {
  try {
    const name = req.body.name;
    const kind = req.body.kind;
    const age = parseInt(req.body.age);
    const id = parseInt(req.params.id);

    await pool
      .query(
        `with updated as
        (UPDATE pets SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind)
         WHERE id = $4 RETURNING *) 
         select * from updated ORDER BY id ASC`,
        [name, age, kind, id]
      )
      .then((data) => {
        res.send(data.rows);
      });
  } catch (error) {
    console.error(error.message);
  }
});

app.delete("/pets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool
      .query("DELETE FROM pets WHERE id = $1 RETURNING *;", [id])
      .then((data) => {
        res.send(data.rows);
      });
  } catch (error) {
    console.error(error.message);
  }
});

app.use((err, req, res, next) => {
    res.sendStatus(500);
  });


app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });