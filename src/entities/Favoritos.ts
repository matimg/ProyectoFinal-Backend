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

    @ManyToOne(() => Usuarios, usuarios => usuarios.id, { nullable: false })
    usuario: Usuarios[];

    @ManyToOne(() => Publicaciones, publicaciones => publicaciones.id)
    publicaciones: Publicaciones[];
}