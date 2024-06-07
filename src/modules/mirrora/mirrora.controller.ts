import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Get
} from '@nestjs/common'
import { MirroraService } from './mirrora.service'
import {
  BuyDto,
  MintERC20Dto,
  StartSaleDto,
  StopSaleDto,
  UpdatePriceDto
} from './dto/mirrora.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Mirrora')
@Controller('mirrora')
export class MirroraController {
  constructor(private readonly mirroraService: MirroraService) {}

  @Post('mint-erc20')
  async mintERC20(@Body() mintERC20Dto: MintERC20Dto) {
    try {
      return await this.mirroraService.asyncMintERC20(mintERC20Dto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('contract-address')
  mirroraSmartContract() {
    return this.mirroraService.mirroraSmartContract()
  }

  @Post('buy')
  async buy(@Body() buyDto: BuyDto) {
    try {
      return await this.mirroraService.buy(buyDto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('start-sale')
  async startSale(@Body() startSaleDto: StartSaleDto) {
    try {
      return await this.mirroraService.startSale(startSaleDto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('stop-sale')
  async stopSale(@Body() stopSaleDto: StopSaleDto) {
    try {
      return await this.mirroraService.stopSale(stopSaleDto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('update-price')
  async updatePrice(@Body() updatePriceDto: UpdatePriceDto) {
    try {
      return await this.mirroraService.updatePrice(updatePriceDto)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('token-info/:tokenId')
  async tokenInfo(@Param('tokenId') tokenId: string) {
    try {
      return await this.mirroraService.tokenInfo(+tokenId)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
