const { leer, guardar, generarId } = require("../data/db");
const Empresa = require("../models/Empresa.js");

const crear = (req, res) => {
  const empresas = leer("empresas");
  const nuevaEmpresa = new Empresa({
    id: generarId("emp", empresas),
    ...req.body,
  })
  empresas.push(nuevaEmpresa);
  guardar("empresas", empresas);
  res.redirect("/empresas");
};

const actualizar = (req, res) => {
  const empresas = leer("empresas");
  const idx = empresas.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
  const activa = req.body.activa === "on";
  const empresaActualizada = new Empresa({ id: req.params.id, ...empresas[idx], ...req.body, activa });
  empresas[idx] = empresaActualizada;
  guardar("empresas", empresas);
  res.redirect("/empresas");
};

const eliminar = (req, res) => {
  const empresas = leer("empresas");
  const nuevaLista = empresas.filter((e) => e.id !== req.params.id);
  guardar("empresas", nuevaLista);
  res.redirect("/empresas");
};

const listar = (req, res) => {
  const empresasData = leer("empresas");
  const empleados = leer("empleados");
  const empresas = empresasData.map((data) => {
    const empresa = new Empresa(data);
    empresa.cantidadEmpleados = empleados.filter(e => e.empresaId === empresa.id).length;
    return empresa;
  });
  res.render("empresas/index", { empresas });
};

const formularioNueva = (req, res) => {
  res.render("empresas/form", { empresa: null, titulo: "Nueva Empresa", accion: "/empresas" });
};

const formularioEditar = (req, res) => {
  const empresas = leer("empresas");
  const empresa = empresas.find((e) => e.id === req.params.id);
  if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
  res.render("empresas/form", { empresa, titulo: "Editar Empresa", accion: `/empresas/${empresa.id}/editar` });
};


module.exports = { crear, actualizar, eliminar, listar, formularioNueva, formularioEditar };