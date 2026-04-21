const fs = require("fs");
const path = require("path");

const filePath = (nombre) => path.join(__dirname, `${nombre}.json`);

const leer = (nombre) => {
  const contenido = fs.readFileSync(filePath(nombre), "utf-8");
  return JSON.parse(contenido);
};

const guardar = (nombre, datos) => {
  fs.writeFileSync(filePath(nombre), JSON.stringify(datos, null, 2));
};

const generarId = (prefijo, items) => {
  const numeros = items
    .map((i) => parseInt(i.id.split("-")[1]))
    .filter((n) => !isNaN(n));
  const siguiente = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
  return `${prefijo}-${String(siguiente).padStart(3, "0")}`;
};

module.exports = { leer, guardar, generarId };
