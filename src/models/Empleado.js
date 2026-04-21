class Empleado {
    constructor ({id, nombre, apellido, dni, empresaId, puesto, salarioBase, activo=true, fechaIngreso}) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.empresaId = empresaId;
        this.puesto = puesto;
        this.salarioBase = Number(salarioBase);
        this.activo = activo;
        this.fechaIngreso = fechaIngreso || new Date().toISOString().split("T")[0];
    }
}

module.exports = Empleado;