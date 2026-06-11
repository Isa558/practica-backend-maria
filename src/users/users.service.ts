import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException(`El usuario "${dto.username}" ya existe`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
    const user = this.usersRepository.create({
      username: dto.username,
      password: hashedPassword,
      isAdmin: dto.isAdmin ?? false,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (this.isDuplicateUsernameError(error)) {
        throw new ConflictException(`El usuario "${dto.username}" ya existe`);
      }
      throw error;
    }
  }

  private isDuplicateUsernameError(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError as { code?: string };
    return driverError.code === 'ER_DUP_ENTRY';
  }
}
