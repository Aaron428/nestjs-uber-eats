import { InputType, Field, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/dots/common-response.dot';
import { User } from '../user.entity';

@ObjectType()
export class LoginResponse extends CommonResponse {
  @Field(() => String, { nullable: true })
  token?: string;
}

@InputType()
export class LoginUserInput extends PickType(User, ['email', 'password']) {}
