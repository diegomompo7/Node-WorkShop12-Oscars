const express = require("express");
const fs = require("fs");

const PORT = 3000;
const server  = express()
const router = express.Router();

router.get("/", (req, res) => {
    fs.readFile("./template/home.html", "utf-8", (readError, data) => {
        res.set("Content-Type", "text/html");
        res.send(data)
    })
})

router.get("/oscars", (req, res) => {
    fs.readdir("./data", "utf-8", (readError, data) => {
        if (readError)
        console.log(readError);
        else{
        res.set("Content-Type", "text/html");
        res.send(data)
        }
    })
})


server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});