import {
    Entity, Column, PrimaryGeneratedColumn, ManyToMany,
    BaseEntity, JoinTable, OneToMany, ManyToOne
} from 'typeorm';

import { Publicaciones } from './Publicaciones';
import { Favoritos } from './Favoritos';
import { Mensajes } from './Mensajes';

@Entity()
export class Usuarios extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    fechaNacimiento: Date;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    password: string;

    @Column()
    tipoUsuario: string;

    @Column()
    activo: boolean;

    @OneToMany(() => Publicaciones, publicacion => publicacion.usuario)
    publicacion: Publicaciones[];

    @OneToMany(() => Favoritos, favoritos => favoritos.id)
    favoritos: Favoritos;

    @OneToMany(() => Mensajes, mensajes => mensajes.id)
    mensajes: Mensajes;
}