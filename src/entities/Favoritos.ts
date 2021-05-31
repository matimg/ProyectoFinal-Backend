import {
    Entity, Column, PrimaryGeneratedColumn, ManyToMany,
    BaseEntity, ManyToOne, JoinColumn, OneToMany
} from 'typeorm';

import { Usuarios } from './Usuarios';
import { Publicaciones } from './Publicaciones';

@Entity()
export class Favoritos extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuarios, usuarios => usuarios.email, {primary: true})
    usuario: Usuarios[];

    @ManyToOne(() => Publicaciones, publicacionesId => publicacionesId.id)
    publicaciones: Publicaciones[];
}