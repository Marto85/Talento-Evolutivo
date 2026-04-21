class Empresa {
    constructor({ id, razonSocial, cuit, contacto, email, activa = true, fechaAlta }) {
        this.id = id;
        this.razonSocial = razonSocial;
        this.cuit = cuit;
        this.contacto = contacto;
        this.email = email;
        this.activa = activa;
        this.fechaAlta = fechaAlta || new Date().toISOString().split("T")[0];
    }
}

module.exports = Empresa;