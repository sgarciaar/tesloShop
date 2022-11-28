import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

//decorador propio de swagger para agrupar los controller
@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  

  @Get()
 // @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user )
 async executeSeed() {
   return this.seedService.runSeed();
  }

}
