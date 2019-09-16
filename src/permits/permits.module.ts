import { Module, Global } from '@nestjs/common';
import { RequirePermitsGuard } from './auth.guard';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
    imports: [UsersModule],
    providers: [RequirePermitsGuard],
    exports: []
})
export class PermitsModule { }
