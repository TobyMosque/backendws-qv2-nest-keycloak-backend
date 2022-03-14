import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiProperty } from '@nestjs/swagger';

class TokenDto {
  @ApiProperty()
  token: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('refresh')
  refresh(@Body() tokenDto: TokenDto, @Res({ passthrough: true }) response: Response): void {
    response.cookie('REFRESH_TOKEN', tokenDto.token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
  }
}
