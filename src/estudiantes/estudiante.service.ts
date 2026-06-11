import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { Estudiante } from './estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async findAll(): Promise<Estudiante[]> {
    return this.estudianteRepository.find();
  }

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const estudiante = this.estudianteRepository.create(dto);
    return this.estudianteRepository.save(estudiante);
  }
}
