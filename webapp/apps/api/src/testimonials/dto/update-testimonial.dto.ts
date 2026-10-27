import { PartialType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './create-testimonial.dto.js';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
