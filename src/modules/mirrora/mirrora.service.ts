import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SmartContractsService } from '@packages/smart-contracts/smart-contracts.service'
import {
  BuyDto,
  MintERC20Dto,
  StartSaleDto,
  StopSaleDto,
  UpdatePriceDto
} from './dto/mirrora.dto'
import { AbiItem } from '@commons/interfaces/smart-contracts.interface'
import Erc20Abi from '@commons/abis/erc20.abi'
import MirorraAbi from '@commons/abis/mirorra.abi'

@Injectable()
export class MirroraService {
  private readonly MIRRORA_SMART_CONTRACT =
    '0x788F4D9990980dF1140F891b7A5Bbae17CA12529'

  private readonly ERC20_SMART_CONTRACT =
    '0x5Adef3e057A4ab8DF7227b505bcf479ad5B065aa'
  private readonly RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  constructor(private readonly smartContractService: SmartContractsService) {}

  mirroraSmartContract() {
    return {
      data: this.MIRRORA_SMART_CONTRACT
    }
  }

  async asyncMintERC20(mintERC20Dto: MintERC20Dto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: mintERC20Dto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: this.ERC20_SMART_CONTRACT,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find((item) => item.name === 'mint') as AbiItem,
        inputs: []
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  //async mint(createMirroraDto: CreateMirroraDto) {}

  async buy(buyDto: BuyDto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: buyDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: this.MIRRORA_SMART_CONTRACT,
        abi: MirorraAbi as AbiItem[],
        targetAbi: MirorraAbi.find((item) => item.name === 'buy') as AbiItem,
        inputs: [buyDto.tokenId.toString()]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async startSale(startSaleDto: StartSaleDto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: startSaleDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: this.MIRRORA_SMART_CONTRACT,
        abi: MirorraAbi as AbiItem[],
        targetAbi: MirorraAbi.find(
          (item) => item.name === 'startSale'
        ) as AbiItem,
        inputs: [startSaleDto.tokenId.toString(), startSaleDto.price.toString()]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async stopSale(stopSaleDto: StopSaleDto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: stopSaleDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: this.MIRRORA_SMART_CONTRACT,
        abi: MirorraAbi as AbiItem[],
        targetAbi: MirorraAbi.find(
          (item) => item.name === 'stopSale'
        ) as AbiItem,
        inputs: [stopSaleDto.tokenId.toString()]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updatePrice(updatePriceDto: UpdatePriceDto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: updatePriceDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: this.MIRRORA_SMART_CONTRACT,
        abi: MirorraAbi as AbiItem[],
        targetAbi: MirorraAbi.find(
          (item) => item.name === 'updatePrice'
        ) as AbiItem,
        inputs: [
          updatePriceDto.tokenId.toString(),
          updatePriceDto.price.toString()
        ]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
  async tokenInfo(tokenId: number) {
    try {
      const { data } = await this.smartContractService.readContract({
        rpcUrl: this.RPC_URL,
        contractAddress: this.MIRRORA_SMART_CONTRACT,
        abi: MirorraAbi as AbiItem[],
        targetAbi: MirorraAbi.find(
          (item) => item.name === 'tokenInfo'
        ) as AbiItem,
        inputs: [tokenId.toString()]
      })
      return data
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
