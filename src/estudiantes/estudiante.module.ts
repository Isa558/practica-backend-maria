import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller';
import { Estudiante } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
})
export class EstudianteModule {}
