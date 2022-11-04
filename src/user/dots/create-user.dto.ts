import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/dots/common-response.dot';
import { User } from '../user.entity';

@InputType()
export class CreateUserInput extends OmitType(User, ['id']) {}

@ObjectType()
export class CreateUserResponse extends CommonResponse {
  @Field(() => String, { nullable: true })
  token?: string;
}
