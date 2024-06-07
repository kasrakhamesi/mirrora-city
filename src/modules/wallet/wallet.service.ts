import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { EthereumService } from '@packages/ethereum/ethereum.service'
import {
  RestoreAddressFromMnemonicDto,
  RestoreAddressFromPrivateKeyDto,
  TransferDto
} from './dto/wallet.dto'
const bip39 = require('bip39')

@Injectable()
export class WalletService {
  private readonly RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  private readonly EXPLORER_URL = 'https://testnet.bscscan.com/'

  constructor(private readonly ethereumService: EthereumService) {}
  async generate() {
    const mnemonic = await bip39.generateMnemonic()
    const address = await this.ethereumService.generateAddress({
      mnemonic,
      deriveIndex: 0
    })
    return { mnemonic, ...address }
  }

  restoreAddressFromPrivateKey(
    restoreAddressFromPrivateKeyDto: RestoreAddressFromPrivateKeyDto
  ) {
    try {
      const address = this.ethereumService.restoreAddressFromPrivateKey({
        privateKey: restoreAddressFromPrivateKeyDto.fromPrivateKey
      })
      return { ...address }
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async restoreAddressFromMnemonic(
    restoreAddressFromMnemonicDto: RestoreAddressFromMnemonicDto
  ) {
    try {
      if (!bip39.validateMnemonic(restoreAddressFromMnemonicDto.mnemonic))
        throw new HttpException('Invalid mnemonic', HttpStatus.BAD_REQUEST)

      const address = await this.ethereumService.generateAddress({
        mnemonic: restoreAddressFromMnemonicDto.mnemonic,
        deriveIndex: 0
      })
      return { mnemonic: restoreAddressFromMnemonicDto.mnemonic, ...address }
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async balance(address: string) {
    try {
      const currentBalance = await this.ethereumService.balance({
        address,
        rpcUrl: this.RPC_URL
      })
      return { balance: currentBalance.balance / 10 ** 18 }
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async transfer(transferDto: TransferDto) {
    try {
      const value = transferDto.amount * 10 ** 18
      return await this.ethereumService.transfer({
        fromPrivateKey: transferDto.fromPrivateKey,
        toAddress: transferDto.to,
        value,
        rpcUrl: this.RPC_URL,
        explorerUrl: this.EXPLORER_URL
      })
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
