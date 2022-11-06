import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { compare, hash } from 'bcrypt';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
  Admin,
  Development,
  Customer,
}

registerEnumType(UserRole, { name: 'userRole' });

@InputType({ isAbstract: true })
@ObjectType({})
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  nickname: string;

  @Field(() => String)
  @Column()
  @IsEmail()
  email: string;

  @Field(() => String)
  @Column({ select: false })
  @Length(6, 32)
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await hash(this.password, 10);
    } catch (e) {
      console.log('pashPassword: ', e);
      throw new InternalServerErrorException('hash password error');
    }
  }

  // 密码校验
  async checkPassword(psd: string) {
    try {
      const res = await compare(psd, this.password);
      return res;
    } catch (e) {
      throw new InternalServerErrorException('compare password error');
    }
  }
}
