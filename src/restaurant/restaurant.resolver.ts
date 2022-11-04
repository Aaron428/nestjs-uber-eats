import { Resolver, Query } from '@nestjs/graphql';
import { Restaurant } from './restaurant.entity';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => Boolean)
  getAllRestaurant() {
    return true;
  }
}
