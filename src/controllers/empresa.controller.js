const { leer, guardar, generarId } = require("../data/db");
const Empresa = require("../models/Empresa.js");
const { validarEmpresa } = require("../utils/validar");

const buildEmpresaList = () => {
  const empresasData = leer("empresas");
  const empleados = leer("empleados");
  return empresasData.map((data) => {
    const empresa = new Empresa(data);
    empresa.cantidadEmpleados = empleados.filter(e => e.empresaId === empresa.id).length;
    return empresa;
  });
};

const crear = (req, res) => {
  const errores = validarEmpresa(req.body);
  if (errores) {
    if (req.accepts('json') && !req.accepts('html')) return res.status(400).json({ errores });
    return res.status(400).render("empresas/index", { empresas: buildEmpresaList(), errores, modalAbierto: "modal-nueva" });
  }

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
  const errores = validarEmpresa(req.body);
  if (errores) {
    if (req.accepts('json') && !req.accepts('html')) return res.status(400).json({ errores });
    return res.status(400).render("empresas/index", { empresas: buildEmpresaList(), errores, modalAbierto: `modal-edit-${req.params.id}` });
  }

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
  const empresas = buildEmpresaList();
  if (req.accepts('json') && !req.accepts('html')) return res.json(empresas);
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


const ver = (req, res) => {
  const empresas = leer("empresas");
  const empleados = leer("empleados");
  const empresa = empresas.find((e) => e.id === req.params.id);
  if (!empresa) {
    if (req.accepts('json') && !req.accepts('html')) return res.status(404).json({ error: "Empresa no encontrada" });
    return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
  }
  empresa.cantidadEmpleados = empleados.filter(e => e.empresaId === empresa.id).length;
  if (req.accepts('json') && !req.accepts('html')) return res.json(empresa);
  res.render("empresas/detail", { empresa });
};

module.exports = { crear, actualizar, eliminar, listar, ver, formularioNueva, formularioEditar };