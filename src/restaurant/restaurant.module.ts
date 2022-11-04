import { Module } from '@nestjs/common';
import { Restaurant } from './restaurant.entity';
import { RestaurantResolver } from './restaurant.resolver';

@Module({
  imports: [Restaurant],
  providers: [RestaurantResolver],
})
export class RestaurantModule {}
