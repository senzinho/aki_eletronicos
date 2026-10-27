import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  authorName!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MinLength(1)
  comment!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  context?: string;

  @IsOptional()
  @IsInt()
  ordering?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
