import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEstudianteDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '2024001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;
}
