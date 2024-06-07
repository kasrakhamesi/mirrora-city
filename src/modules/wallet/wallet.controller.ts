import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common'
import { WalletService } from './wallet.service'
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  RestoreAddressFromMnemonicDto,
  RestoreAddressFromPrivateKeyDto,
  TransferDto
} from './dto/wallet.dto'

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('generate')
  async generateWallet() {
    try {
      return await this.walletService.generate()
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('restore-from-private-key')
  @ApiBody({ type: RestoreAddressFromPrivateKeyDto })
  async restoreAddressFromPrivateKey(
    @Body() restoreAddressFromPrivateKeyDto: RestoreAddressFromPrivateKeyDto
  ) {
    try {
      return await this.walletService.restoreAddressFromPrivateKey(
        restoreAddressFromPrivateKeyDto
      )
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('restore-from-mnemonic')
  @ApiBody({ type: RestoreAddressFromMnemonicDto })
  async restoreAddressFromMnemonic(
    @Body() restoreAddressFromMnemonicDto: RestoreAddressFromMnemonicDto
  ) {
    try {
      return await this.walletService.restoreAddressFromMnemonic(
        restoreAddressFromMnemonicDto
      )
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('balance')
  @ApiQuery({ name: 'address', required: true })
  async getBalance(@Query('address') address: string) {
    try {
      return await this.walletService.balance(address)
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('transfer')
  @ApiBody({ type: TransferDto })
  async transfer(@Body() transferDto: TransferDto) {
    try {
      return await this.walletService.transfer(transferDto)
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }
}
