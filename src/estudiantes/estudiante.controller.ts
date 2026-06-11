import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EstudianteResponseDto } from './dto/estudiante-response.dto';
import { EstudianteService } from './estudiante.service';

@ApiTags('estudiante')
@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get()
  @ApiOperation({ summary: 'Listar estudiantes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estudiantes',
    type: [EstudianteResponseDto],
  })
  async findAll(): Promise<EstudianteResponseDto[]> {
    const estudiantes = await this.estudianteService.findAll();
    return estudiantes.map(EstudianteResponseDto.fromEntity);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear estudiante (solo admin)' })
  @ApiResponse({
    status: 201,
    description: 'Estudiante creado',
    type: EstudianteResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async create(
    @Body() createEstudianteDto: CreateEstudianteDto,
  ): Promise<EstudianteResponseDto> {
    const estudiante = await this.estudianteService.create(createEstudianteDto);
    return EstudianteResponseDto.fromEntity(estudiante);
  }
}
