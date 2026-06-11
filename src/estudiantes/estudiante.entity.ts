import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estudiante')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;
}
