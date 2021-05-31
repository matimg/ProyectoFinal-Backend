import {
    Entity, Column, PrimaryGeneratedColumn, ManyToMany,
    BaseEntity, JoinTable, OneToMany, ManyToOne
} from 'typeorm';

import { Publicaciones } from './Publicaciones';
import { Favoritos } from './Favoritos';
import { Mensajes } from './Mensajes';

@Entity()
export class Usuarios extends BaseEntity {
    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    fechaNacimiento: Date;

    @Column({ primary: true })
    email: string;

    @Column()
    password: string;

    @Column()
    tipoUsuario: string;

    @OneToMany(() => Publicaciones, publicacion => publicacion.usuario)
    publicacion: Publicaciones[];

    @OneToMany(() => Favoritos, favoritos => favoritos.id)
    favoritos: Favoritos;

    @OneToMany(() => Mensajes, mensajes => mensajes.id)
    mensajes: Mensajes;
}