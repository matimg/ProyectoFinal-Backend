import {
    Entity, Column, PrimaryGeneratedColumn, ManyToMany,
    BaseEntity, ManyToOne, OneToMany
} from 'typeorm';

import { Usuarios } from './Usuarios';
import { Favoritos } from './Favoritos';

@Entity()
export class Publicaciones extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @Column()
    url: string;

    @Column()
    categoria: string;

    @Column()
    formato: string;

    @ManyToOne(() => Usuarios, usuario => usuario.id, { nullable: false })
    usuario: Usuarios;

    @OneToMany(() => Favoritos, favoritos => favoritos.id)
    favoritos: Favoritos[];
}