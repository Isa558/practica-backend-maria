import { ApiProperty } from '@nestjs/swagger';
import { Estudiante } from '../estudiante.entity';

export class EstudianteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan' })
  nombre: string;

  @ApiProperty({ example: '2024001' })
  codigo: string;

  static fromEntity(estudiante: Estudiante): EstudianteResponseDto {
    return {
      id: estudiante.id,
      nombre: estudiante.nombre,
      codigo: estudiante.codigo,
    };
  }
}
