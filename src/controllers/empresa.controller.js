const Empresa = require("../models/Empresa.js");
const Empleado = require("../models/Empleado.js");
const { validarEmpresa } = require("../utils/validar");

const formatearCuit = (cuit) => {
  if (!cuit) return cuit;
  const cuitString = String(cuit).trim();
  if (/^\d{2}-\d{7,8}-\d{1}$/.test(cuitString)) return cuitString;
  
  const limpio = cuitString.replace(/[^\d]/g, '');
  if (limpio.length === 10) {
    return `${limpio.slice(0, 2)}-${limpio.slice(2, 9)}-${limpio.slice(9)}`;
  } else if (limpio.length === 11) {
    return `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`;
  }
  return cuitString;
};

const buildEmpresaList = async () => {
  const empresas = await Empresa.find();
  const empresasConEmpleados = await Promise.all(
    empresas.map(async (empresa) => {
      const cantidadEmpleados = await Empleado.countDocuments({ empresaId: empresa._id });
      return { ...empresa.toObject(), id: empresa.id, cantidadEmpleados };
    })
  );
  return empresasConEmpleados;
};

const crear = async (req, res, next) => {
  try {
    if (req.body.cuit) {
      req.body.cuit = formatearCuit(req.body.cuit);
    }

    const errores = validarEmpresa(req.body);
    if (errores) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(400).json({ errores });
      const empresas = await buildEmpresaList();
      return res.status(400).render("empresas/index", { empresas, errores, modalAbierto: "modal-nueva", empresa: req.body });
    }

    const empresa = new Empresa(req.body);
    await empresa.save();
    res.redirect("/empresas");
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    if (req.body.cuit) {
      req.body.cuit = formatearCuit(req.body.cuit);
    }

    const errores = validarEmpresa(req.body);
    if (errores) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(400).json({ errores });
      const empresas = await buildEmpresaList();
      return res.status(400).render("empresas/index", { empresas, errores, modalAbierto: `modal-edit-${req.params.id}`, empresa: { ...req.body, id: req.params.id, _id: req.params.id } });
    }

    const activa = req.body.activa === "on";
    const empresa = await Empresa.findByIdAndUpdate(req.params.id, { ...req.body, activa }, { new: true, runValidators: true });

    if (!empresa) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empresa no encontrada" });
      return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
    }

    res.redirect("/empresas");
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const empresa = await Empresa.findByIdAndDelete(req.params.id);

    if (!empresa) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empresa no encontrada" });
      return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
    }

    await Empleado.deleteMany({ empresaId: req.params.id });
    res.redirect("/empresas");
  } catch (error) {
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const empresas = await buildEmpresaList();
    if (req.accepts("json") && !req.accepts("html")) return res.json(empresas);
    res.render("empresas/index", { empresas });
  } catch (error) {
    next(error);
  }
};

const formularioNueva = (req, res) => {
  res.render("empresas/form", { empresa: null, titulo: "Nueva Empresa", accion: "/empresas" });
};

const formularioEditar = async (req, res, next) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
    res.render("empresas/form", { empresa, titulo: "Editar Empresa", accion: `/empresas/${empresa._id}/editar` });
  } catch (error) {
    next(error);
  }
};

const ver = async (req, res, next) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      if (req.accepts("json") && !req.accepts("html")) return res.status(404).json({ error: "Empresa no encontrada" });
      return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
    }

    const cantidadEmpleados = await Empleado.countDocuments({ empresaId: req.params.id });
    const empresaObj = { ...empresa.toObject(), id: empresa.id, cantidadEmpleados };

    if (req.accepts("json") && !req.accepts("html")) return res.json(empresaObj);
    res.render("empresas/detail", { empresa: empresaObj });
  } catch (error) {
    next(error);
  }
};

module.exports = { crear, actualizar, eliminar, listar, ver, formularioNueva, formularioEditar };