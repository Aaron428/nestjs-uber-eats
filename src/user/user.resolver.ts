import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserResponse } from './dots/create-user.dto';
import { LoginResponse, LoginUserInput } from './dots/login.dto';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User)
  whoAmI(@Context() ctx: ExecutionContext) {
    return ctx['user'];
  }

  @Mutation(() => LoginResponse)
  login(@Args('input') loginUserInput: LoginUserInput): Promise<LoginResponse> {
    return this.userService.userLogin(loginUserInput);
  }

  @Mutation(() => CreateUserResponse)
  createAccount(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserResponse> {
    return this.userService.createAccount(createUserInput);
  }
}
