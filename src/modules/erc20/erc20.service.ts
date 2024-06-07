import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SmartContractsService } from '@packages/smart-contracts/smart-contracts.service'
import { AbiItem } from '@commons/interfaces/smart-contracts.interface'
import {
  TransferDto,
  ApproveDto,
  DecreaseAllowanceDto,
  IncreaseAllowanceDto,
  TransferFromDto
} from './dto/erc20.dto'
import Erc20Abi from '@commons/abis/erc20.abi'

@Injectable()
export class Erc20Service {
  private readonly RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

  constructor(private readonly smartContractService: SmartContractsService) {}

  async decimals(contractAddress: string) {
    try {
      return await this.smartContractService.readContract({
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find((item) => item.name === 'decimals') as AbiItem,
        inputs: []
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async balanceOf(contractAddress: string, address: string) {
    try {
      return await this.smartContractService.readContract({
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find(
          (item) => item.name === 'balanceOf'
        ) as AbiItem,
        inputs: [address]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async allowance(contractAddress: string, owner: string, spender: string) {
    try {
      return await this.smartContractService.readContract({
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find(
          (item) => item.name === 'allowance'
        ) as AbiItem,
        inputs: [owner, spender]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async totalSupply(contractAddress: string) {
    try {
      return await this.smartContractService.readContract({
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find(
          (item) => item.name === 'totalSupply'
        ) as AbiItem,
        inputs: []
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async transfer(contractAddress: string, transferDto: TransferDto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: transferDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find((item) => item.name === 'transfer') as AbiItem,
        inputs: [transferDto.to, transferDto.amount]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async approve(contractAddress: string, approveDto: ApproveDto) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: approveDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find((item) => item.name === 'approve') as AbiItem,
        inputs: [approveDto.spender, approveDto.amount]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async decreaseAllowance(
    contractAddress: string,
    decreaseAllowanceDto: DecreaseAllowanceDto
  ) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: decreaseAllowanceDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find(
          (item) => item.name === 'decreaseAllowance'
        ) as AbiItem,
        inputs: [
          decreaseAllowanceDto.spender,
          decreaseAllowanceDto.subtractedValue
        ]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async increaseAllowance(
    contractAddress: string,
    increaseAllowanceDto: IncreaseAllowanceDto
  ) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: increaseAllowanceDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find(
          (item) => item.name === 'increaseAllowance'
        ) as AbiItem,
        inputs: [increaseAllowanceDto.spender, increaseAllowanceDto.addedValue]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async transferFrom(
    contractAddress: string,
    transferFromDto: TransferFromDto
  ) {
    try {
      return await this.smartContractService.writeContract({
        fromPrivateKey: transferFromDto.fromPrivateKey,
        rpcUrl: this.RPC_URL,
        contractAddress: contractAddress,
        abi: Erc20Abi as AbiItem[],
        targetAbi: Erc20Abi.find(
          (item) => item.name === 'transferFrom'
        ) as AbiItem,
        inputs: [
          transferFromDto.from,
          transferFromDto.to,
          transferFromDto.amount
        ]
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
