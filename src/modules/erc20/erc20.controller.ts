import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Erc20Service } from './erc20.service'
import {
  TransferDto,
  ApproveDto,
  DecreaseAllowanceDto,
  IncreaseAllowanceDto,
  TransferFromDto
} from './dto/erc20.dto'
import { ApiQuery, ApiTags } from '@nestjs/swagger'

@Controller('erc20/:contractAddress')
@ApiTags('erc20')
export class Erc20Controller {
  constructor(private readonly erc20Service: Erc20Service) {}

  @Get('decimals')
  async decimals(@Param('contractAddress') contractAddress: string) {
    try {
      return await this.erc20Service.decimals(contractAddress)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('balanceOf')
  @ApiQuery({ name: 'address', required: true, type: String })
  @UsePipes(new ValidationPipe({ transform: true }))
  async balanceOf(
    @Param('contractAddress') contractAddress: string,
    @Query('address') address: string
  ) {
    try {
      if (!address) {
        throw new HttpException('address is required', HttpStatus.BAD_REQUEST)
      }

      return await this.erc20Service.balanceOf(contractAddress, address)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('allowance')
  @ApiQuery({ name: 'owner', required: true, type: String })
  @ApiQuery({ name: 'spender', required: true, type: String })
  @UsePipes(new ValidationPipe({ transform: true }))
  async allowance(
    @Param('contractAddress') contractAddress: string,
    @Query('owner') owner: string,
    @Query('spender') spender: string
  ) {
    try {
      if (!owner || !spender) {
        throw new HttpException(
          'Owner and spender are required',
          HttpStatus.BAD_REQUEST
        )
      }

      return await this.erc20Service.allowance(contractAddress, owner, spender)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('totalSupply')
  async totalSupply(@Param('contractAddress') contractAddress: string) {
    try {
      return await this.erc20Service.totalSupply(contractAddress)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('transfer')
  async transfer(
    @Param('contractAddress') contractAddress: string,
    @Body() transferDto: TransferDto
  ) {
    try {
      return await this.erc20Service.transfer(contractAddress, transferDto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('approve')
  async approve(
    @Param('contractAddress') contractAddress: string,
    @Body() approveDto: ApproveDto
  ) {
    try {
      return await this.erc20Service.approve(contractAddress, approveDto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('decreaseAllowance')
  async decreaseAllowance(
    @Param('contractAddress') contractAddress: string,
    @Body() decreaseAllowanceDto: DecreaseAllowanceDto
  ) {
    try {
      return await this.erc20Service.decreaseAllowance(
        contractAddress,
        decreaseAllowanceDto
      )
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('increaseAllowance')
  async increaseAllowance(
    @Param('contractAddress') contractAddress: string,
    @Body() increaseAllowanceDto: IncreaseAllowanceDto
  ) {
    try {
      return await this.erc20Service.increaseAllowance(
        contractAddress,
        increaseAllowanceDto
      )
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('transferFrom')
  async transferFrom(
    @Param('contractAddress') contractAddress: string,
    @Body() transferFromDto: TransferFromDto
  ) {
    try {
      return await this.erc20Service.transferFrom(
        contractAddress,
        transferFromDto
      )
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
