"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
exports.Usuarios = void 0;
var typeorm_1 = require("typeorm");
var Publicaciones_1 = require("./Publicaciones");
var Favoritos_1 = require("./Favoritos");
var Mensajes_1 = require("./Mensajes");
var Usuarios = /** @class */ (function (_super) {
    __extends(Usuarios, _super);
    function Usuarios() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Usuarios.prototype, "id");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuarios.prototype, "nombre");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuarios.prototype, "apellido");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], Usuarios.prototype, "fechaNacimiento");
    __decorate([
        typeorm_1.Column({ unique: true, nullable: false }),
        __metadata("design:type", String)
    ], Usuarios.prototype, "email");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuarios.prototype, "password");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuarios.prototype, "tipoUsuario");
    __decorate([
        typeorm_1.OneToMany(function () { return Publicaciones_1.Publicaciones; }, function (publicacion) { return publicacion.usuario; }),
        __metadata("design:type", Array)
    ], Usuarios.prototype, "publicacion");
    __decorate([
        typeorm_1.OneToMany(function () { return Favoritos_1.Favoritos; }, function (favoritos) { return favoritos.id; }),
        __metadata("design:type", Favoritos_1.Favoritos)
    ], Usuarios.prototype, "favoritos");
    __decorate([
        typeorm_1.OneToMany(function () { return Mensajes_1.Mensajes; }, function (mensajes) { return mensajes.id; }),
        __metadata("design:type", Mensajes_1.Mensajes)
    ], Usuarios.prototype, "mensajes");
    Usuarios = __decorate([
        typeorm_1.Entity()
    ], Usuarios);
    return Usuarios;
}(typeorm_1.BaseEntity));
exports.Usuarios = Usuarios;
