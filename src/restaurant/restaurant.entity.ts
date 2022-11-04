import { Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, Length, IsString, Min, Max } from 'class-validator';

@Entity()
export class Restaurant {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @IsString()
  @Length(2, 20)
  @Column()
  name: string;

  @Field(() => String)
  @IsString()
  @Length(2, 100)
  @Column()
  address: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Field(() => Number, { defaultValue: 0 })
  @IsNumber()
  @Column({ default: 0 })
  sellQuality: number;
}
