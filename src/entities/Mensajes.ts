import {
    Entity, Column, PrimaryGeneratedColumn, ManyToMany,
    BaseEntity, ManyToOne, JoinColumn, OneToMany
} from 'typeorm';

import { Usuarios } from './Usuarios';
import { Publicaciones } from './Publicaciones';

@Entity()
export class Mensajes extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuarios, usuarios => usuarios.email, {primary: true})
    usuarioEmisor: Usuarios;
    
    @ManyToOne(() => Usuarios, usuarios => usuarios.email, {primary: true})
    usuarioReceptor: Usuarios;

    @Column()
    asunto: string;

    @Column()
    mensaje: string;
}