import { SetMetadata } from '@nestjs/common';

export const RequirePermits = (...args: string[]) => SetMetadata('permits', args);
