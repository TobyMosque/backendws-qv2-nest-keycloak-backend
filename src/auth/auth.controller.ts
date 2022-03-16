import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TokenDto } from './dto/token';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('refresh')
  refresh(
    @Body() tokenDto: TokenDto,
    @Res({ passthrough: true }) response: Response,
  ): void {
    response.cookie('REFRESH_TOKEN', tokenDto.token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
}
