import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialLinkDto } from './create-social-link.dto.js';

export class UpdateSocialLinkDto extends PartialType(CreateSocialLinkDto) {}
