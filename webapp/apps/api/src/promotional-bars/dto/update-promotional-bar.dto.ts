import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionalBarDto } from './create-promotional-bar.dto.js';

export class UpdatePromotionalBarDto extends PartialType(CreatePromotionalBarDto) {}
