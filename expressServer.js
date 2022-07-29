import { fstat, rmSync } from "fs";
import http from "http";
import fs from "fs";
import { readPetsFile } from "./shared.js";
import { userInfo } from "os";
import express from "express";
import { error } from "console";


console.log(process.argv)
//so, i used thunderclient to get the results, will not work in terminal??? could use process.argv.
//globals
const app = express();
app.use(express.json());


//general get for entire obj
app.get("/pets", (req, res) => {
  readPetsFile().then((data) => {
    if (data != null) {
      res.end(JSON.stringify(data));
    }
    if (data == null) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Not Found");
    }
  });
});
//get pets by #
app.get("/pets/*", (req, res) => {
  const id = req.params[0];

  readPetsFile().then((data) => {
    if (data[id] != undefined) {
      res.end(JSON.stringify(data[id]));
    }
    //if no pet return 404 not found
    if (data[id] == null) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Not Found");
    }
  });
});
//post to pets.JSON
app.post("/pets*", (req, res) => {
  //values split into individual pieces first then broken down to age, type, name. better to parseInt here maybe?
  const values = req.params[0].split(" ");
  const valueAge = values[1];
  const valueType = values[2];
  const valueName = values[3];
  //edge cases covered here to correct user input
  if (values.length >= 5 || values.length <= 3) {
    res.send("Correct format is: /pets `AGE` `KIND` `NAME`");
    //assuming edge case criteria is valid then do:
  } else {
    readPetsFile().then((data) => {
      const petData = {
        age: parseInt(valueAge),
        kind: valueType,
        name: valueName,
      };
      data.push(petData); //push to JSON obj
      console.log(data);
      //write to JSON
      fs.writeFile("./pets.json", JSON.stringify(data), (err) => {
        //Not sure if this error code works??????????????? edge case up top should catch before error occurs
        if (err) throw err;
        console.log(data);
        return;
      });
      res.send("Entry was filled.");
    });
  }
});

//server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
