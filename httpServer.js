import { fstat, rmSync } from "fs";
import http from "http";
import fs from "fs";
import {readPetsFile} from "./shared.js"
import { userInfo } from "os";

//globals
const petRegExp = /^\/pets\/(.*)$/;
// const url =  `/pets/0`;

// const dataIndex = parseInt(url.match(petRegExp)[1]);
//see whats doing what
// console.log(petRegExp);
// console.log(url)
// console.log(url.match(petRegExp));

// console.log(dataIndex);
//server creation and dynamic input
const server = http.createServer((req, res) => {
    //get request to /pets
    //read pets.json and return contents
    const dynamicURL = req.url.match(petRegExp);
    console.log(dynamicURL)
    if (req.method === "GET" && req.url === "/pets") {
        
        console.log(id)
        readPetsFile().then((data) => {
            res.end(JSON.stringify(data));
        })
               
    // } else if (req.method === "GET" && req.url === petRegExp) {
    //     readPetsFile().then((data) => {
    //         res.end(JSON.stringify(data[0]));
    //     })
               
    // } else if (req.method === "GET" && req.url === "/pets/1") {
    //     readPetsFile().then((data) => {
    //         res.end(JSON.stringify(data[1]));
    //     })
    } else if (dynamicURL &&  req.method === "GET") {
        const id = dynamicURL[1]
        readPetsFile().then((data) => {
            if (data[id]) {
            res.end(JSON.stringify(data[id]));
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Not Found');
            }
        })
    } 

    // if (req.method === "POST" && req.url === '/pets') {
    //     readPetsFile().then((data) => {
    //         const petData = {
    //             "age": parseInt(value1),
    //             "kind": value2,
    //             "name": value3
    //           };
    //     })
    // }
    

});


server.listen(3001, () => {
    console.log("listening on port 3001")
})