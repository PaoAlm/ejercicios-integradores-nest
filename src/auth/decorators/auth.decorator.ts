import { applyDecorators, UseGuards } from '@nestjs/common';

import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from 'src/estudiantes/interfaces/valid-roles';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}

