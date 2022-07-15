import fs, { read } from "fs";
// import { writeFile } from "node:fs";
console.log(process.argv);
const subcommand = process.argv[2];
const userIndex = process.argv[3];
const value1 = process.argv[3];
const value2 = process.argv[4];
const value3 = process.argv[5];

switch (subcommand) {
  case `read`:
    fs.readFile("./pets.json", "utf-8", (err, str) => {
      const data = JSON.parse(str);
      console.log(data[userIndex], "data");
      if (data[value1] === undefined) {
        console.error("Usage: node pets.js read INDEX");
      }
    });

    break;

  case "create":
    fs.readFile("./pets.json", "utf-8", (err, str) => {
      const data = JSON.parse(str);
      const petData = {
        "age": parseInt(value1),
        "kind": value2,
        "name": value3
      };
      data.push(petData);
      fs.writeFile("./pets.json", JSON.stringify(data), (err) => { 
        if (err) throw err;
        console.log(data);
        return;
      });      
    });







//   case "update":

//   case "destroy":
//   default: {
//     console.error("Usage: node pets.js [read | create | update | destroy]");
//   }
}
