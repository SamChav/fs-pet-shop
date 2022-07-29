import express from "express";
import { readPetsFile } from "./shared.js";
import fs from "fs";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
app.use(express.json());

// let id = 1;
// const makeID = (data) => {
//     return {id: id++, ...data}
// };


//post to pets with name age kind

app.post("/pets*", (req, res) => {
  res.type("application/json");
//using input from user for name, age, kind
  const values = req.params[0].split(" ");
  const valueAge = values[2];
  const valueType = values[3];
  const valueName = values[1];  
//edge case if user tries to enter anything aside from the appropriate format
  if (values.length >= 5 || values.length <= 3) {
    res.status(406).send("Correct format is: /pets `NAME` `AGE` `KIND`");
  } else {
//build the obj to JSON
  readPetsFile().then((data) => {    
    const petData = {
      name: valueName,
      age: parseInt(valueAge),
      kind: valueType,
    };
    data.push(petData);    
    fs.writeFile("./pets.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      res.status(200).end('complete');
    });
  });
};
});
//get /pets/3 is suppose to get the post request the user put in above per MD instructions (not dynamic?)
app.get("/pets/:id", (req, res) => {
  console.log(req.params.id)
  // readPetsFile().then((data) => {
  //   if (data[2] == undefined) {
  //     res.type("text/plain")
  //     res.status(404).send('This entry does not exist');
  //   } else {
  //     res.status(200);
  //     res.type("application/json");
  //     res.send(JSON.stringify(data[2]));
  //   }    
  // });
  const id = 
  pool.query("SELECT * FROM pets").then((data) => {
    res.send(data.rows);
    // console.log(res.rows)
    // pool.end();
  });

});

//patch converts pets/3 to whatever the user types in per the MD instructions
app.patch("/pets/3*", (req, res) => {
  res.type("application/json");  
  const values = req.params[0].split(" ")
  const name = values[1]
  console.log(name);
  res.status(200); 
  readPetsFile().then((data) => {
    data[2].name = name; 
    fs.writeFile("./pets.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      res.end('name updated');
    });
  });
});

app.delete("/pets/3", (req, res) => {
  res.type("application/json");
  
  readPetsFile().then((data) => {
    if (data[2] != undefined) {
      data.splice(2);
      fs.writeFile("./pets.json", JSON.stringify(data), (err) => {
        if (err) throw err;
        res.status(200).send("deleted entry");       
      });
    } else if (data[2] === undefined) {
      res.type("text");
      res.status(404).send("Data entry does not exist");
    }
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


const pool = new pg.Pool({
  //   user: 'samchav',
    password: 'oppji',
    database: 'petshop',  
    // host: 'localhost',
    // port: 3001
  });
  
  
  // pool.query('SELECT * FROM pets', (err, res) => {
  //   console.log(res.rows)
  //   pool.end();
  // });
