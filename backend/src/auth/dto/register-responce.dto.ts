import { OmitType } from '@nestjs/swagger';
import { RegisterDTO } from './register.dto';

export class RegisterResponseDTO extends OmitType(RegisterDTO, ['password'] as const) {}
