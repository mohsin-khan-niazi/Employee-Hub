import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dtos/create-leave.dto';
import { UpdateLeaveDto } from './dtos/update-leave.dto';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from '../roles/roles.decorator';

@ApiTags('Leaves')
@Controller('leaves')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Body() createLeaveDto: CreateLeaveDto, @Request() req) {
    return this.leaveService.createLeave(req.user.id, createLeaveDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  findAll() {
    return this.leaveService.getAllLeaves();
  }

  @Get('my-leaves')
  findMyLeaves(@Request() req) {
    return this.leaveService.getUserLeaves(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.getLeaveById(id);
  }

  @Put(':id/status')
  @Roles(RoleEnum.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() updateLeaveDto: UpdateLeaveDto,
    @Request() req,
  ) {
    return this.leaveService.updateLeaveStatus(id, updateLeaveDto, req.user.id);
  }
}
