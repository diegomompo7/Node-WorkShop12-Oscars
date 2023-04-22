const express = require("express");
const fs = require("fs");
const prompt = require("prompt-sync")();

const PORT = 3000;
const server = express();
const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile("./template/home.html", "utf-8", (readError, data) => {
    res.set("Content-Type", "text/html");
    res.send(data);
  });
});

router.get("/oscars", (req, res) => {
  fs.readdir("./data", "utf-8", (readError, data) => {
    if (readError) console.log(readError);
    else {
      res.set("Content-Type", "text/html");
      res.send(data);
    }
  });
});

router.get("/oscars/:oscar_year", (req, res) => {
  fs.readdir("./data", "utf-8", (readError, data) => {
    if (readError) console.log(readError);
    else {
      const osc_year = parseInt(req.params.oscar_year);
      const fileYear = data.find((year) => year.includes(osc_year));
      if (fileYear) {
        fs.readFile("./data/" + fileYear, (error, data) => {
          if (error) {
            res.status(500).send("Error inesperado");
          } else {
            const winnersYear = JSON.parse(data);
            res.json(winnersYear);
          }
        });
      } else {
        res.status(404).send("HTTP Error 404: Fichero con encontrado.");
      }
    }
  });
});

const createWinner = () => {
  const oscars = [];
  const oscarCategory = prompt(`Introduce el nombre de la categoría: `);
  const oscarWinner = prompt(`Introduce el nombre del ganador: `);

  const oscar = {
    category: oscarCategory,
    winner: oscarWinner,
  };

  oscars.push(oscar);

  return oscars;
};

router.post("/oscars/:year", (req, res) => {
    console.log("hola")
  const osc_year = parseInt(req.params.year);
  const oscarToAdd = createWinner();

  fs.readFile("./data/oscars-" + osc_year + ".json", (error, data) => {
    if (error) {
        console.log("./data/oscars-" + osc_year + ".json")
        try {
            const oscarString = JSON.stringify(oscarToAdd);
    
            fs.writeFile("./data/oscars-" + osc_year + ".json", oscarString, (error) => {
              if (error) {
                console.log("Ha ocurrido un error escribiendo el fichero");
                console.log(error);
              } else {
                console.log("Fichero guardado correctamente!");
              }
            });
          } catch (parseError) {
            console.log("Ha ocurrido un error PARSEANDO el fichero");
            console.log(parseError);
          }
    } else {
      try {
        const oscars = JSON.parse(data);
        const newOscars = [...oscars, ...oscarToAdd];
        const oscarString = JSON.stringify(newOscars);

        fs.writeFile("./data/oscars-" + osc_year + ".json", oscarString, (error) => {
          if (error) {
            console.log("Ha ocurrido un error escribiendo el fichero");
            console.log(error);
          } else {
            console.log("Fichero guardado correctamente!");
          }
        });
      } catch (parseError) {
        console.log("Ha ocurrido un error PARSEANDO el fichero");
        console.log(parseError);
      }
    }
  });
})


server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});

router.get("/winners-multiple/:oscar_year", (req, res) => {
    const allWinners = {"winners": [{"name": "", "awards" : [{"category" : ""}]}]}

    fs.readdir("./data", "utf-8", (readError, data) => {
      if (readError) console.log(readError);
      else {
        const osc_year = parseInt(req.params.oscar_year);
        const fileYear = data.find((year) => year.includes(osc_year));
        if (fileYear) {
          fs.readFile("./data/" + fileYear, (error, data) => {
            if (error) {
              res.status(500).send("Error inesperado");
            } else {
              const winnersYear = JSON.parse(data);
              for (let clave in winnersYear){
                console.log(Object.values(winnersYear))
                if(winnersYear[clave.entity] !== allWinners.winners.name){
                    allWinners[
                        {
                            winners:[
                                {
                                    name: winnersYear[clave.entity], 
                                    awards:[
                                        {category: winnersYear[clave.category]}
                                    ]
                                }
                            ]
                        }]
                }
              }
             console.log(allWinners)
            }
          });         
        } else {
          res.status(404).send("HTTP Error 404: Fichero con encontrado.");
        }
      }
    });
  });