import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import {
  IEstimateWriteContractFee,
  IEstimateWriteContractFeeResponse,
  IReadContract,
  ISmartContracts,
  IWriteContract,
  IWriteContractResponse
} from '@commons/interfaces/smart-contracts.interface'
import {
  IRestoreAddressFromPrivateKey,
  IRestoreAddressFromPrivateKeyResponse
} from '@commons/interfaces/coins.interface'
import Web3, { ContractAbi } from 'web3'
import ethereumWallet from 'ethereumjs-wallet'
import { isEmpty } from 'class-validator'
import BigNumber from 'bignumber.js'

@Injectable()
export class SmartContractsService implements ISmartContracts {
  private isBigInt(value: any): boolean {
    return typeof value === 'bigint'
  }

  private convertBigIntToString(obj: any): any {
    if (typeof obj === 'bigint') {
      return obj.toString()
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = this.convertBigIntToString(obj[key])
        }
      }
    }
    return obj
  }

  public async readContract({
    contractAddress,
    rpcUrl,
    abi,
    targetAbi,
    inputs
  }: IReadContract): Promise<any> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const contract = new web3.eth.Contract(
        abi as ContractAbi,
        contractAddress
      )

      const methodCall: any = contract.methods[targetAbi.name]
      const result = await methodCall(...inputs).call()

      const convertedResult = this.convertBigIntToString(result)

      return { data: convertedResult }
    } catch (e) {
      throw new HttpException(e?.cause || e.message, HttpStatus.BAD_REQUEST)
    }
  }

  public async writeContract({
    fromPrivateKey,
    contractAddress,
    rpcUrl,
    abi,
    targetAbi,
    inputs,
    data,
    value
  }: IWriteContract): Promise<IWriteContractResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const contract = new web3.eth.Contract(
        abi as ContractAbi,
        contractAddress
      )

      const chainId = await web3.eth.getChainId()

      let gasLimit = BigInt(0)

      const from = this.restoreAddressFromPrivateKey({
        privateKey: fromPrivateKey
      })

      const nonce = await web3.eth.getTransactionCount(from.address, 'pending')

      const newValue = isEmpty(value) ? BigInt(0) : value

      if (isEmpty(data)) {
        const methodCall: any = contract.methods[targetAbi.name]
        data = await methodCall(...inputs).encodeABI()
        gasLimit = await methodCall(...inputs).estimateGas({
          from: from.address,
          value: newValue
        })
      } else {
        gasLimit = await web3.eth.estimateGas({
          from: from.address,
          to: contractAddress,
          data,
          nonce,
          value: newValue
        })
      }

      const gasPrice = await web3.eth.getGasPrice()

      const txParams = {
        nonce,
        chainId,
        value: newValue,
        data,
        gasLimit: BigInt(
          Math.round(
            Number(BigNumber(gasLimit.toString()).multipliedBy(1.5).toString())
          )
        ),
        gasPrice: BigInt(
          Math.round(
            Number(BigNumber(gasPrice.toString()).multipliedBy(1.5).toString())
          )
        ),
        to: contractAddress
      }

      const rawTransaction = await web3.eth.accounts.signTransaction(
        txParams,
        fromPrivateKey
      )

      const transactionResult = await web3.eth.sendSignedTransaction(
        rawTransaction?.rawTransaction
      )

      return {
        transactionId: String(transactionResult?.transactionHash)
      }
    } catch (e) {
      throw new HttpException(e?.cause || e.message, HttpStatus.BAD_REQUEST)
    }
  }

  public async estimateWriteContractFee({
    fromAddress,
    contractAddress,
    abi,
    targetAbi,
    inputs,
    data,
    rpcUrl,
    value
  }: IEstimateWriteContractFee): Promise<IEstimateWriteContractFeeResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending')

      const contract = new web3.eth.Contract(
        abi as ContractAbi,
        contractAddress
      )

      const newValue = isEmpty(value) ? BigInt(0) : value

      let gasLimit = BigInt(0)
      if (isEmpty(data)) {
        const methodCall: any = contract.methods[targetAbi.name]
        data = await methodCall(...inputs).encodeABI()
        gasLimit = await methodCall(...inputs).estimateGas({
          from: fromAddress,
          nonce,
          value: newValue
        })
      } else {
        gasLimit = await web3.eth.estimateGas({
          to: contractAddress,
          data,
          nonce,
          value: newValue
        })
      }

      const gasPrice = await web3.eth.getGasPrice()

      const newGasPrice = BigInt(
        Math.round(
          Number(BigNumber(gasPrice.toString()).multipliedBy(1.5).toString())
        )
      )
      const newGasLimit = BigInt(
        Math.round(
          Number(BigNumber(gasLimit.toString()).multipliedBy(1.5).toString())
        )
      )

      const networkFee = new BigNumber(newGasPrice.toString()).multipliedBy(
        newGasLimit.toString()
      )

      const networkFeeEther = networkFee.dividedBy(new BigNumber('1e18'))

      return {
        error: false,
        value: Number(networkFeeEther),
        message: 'Fee successfully estimated'
      }
    } catch {
      return { error: true, value: 0, message: 'Insufficient funds' }
    }
  }

  public restoreAddressFromPrivateKey({
    privateKey
  }: IRestoreAddressFromPrivateKey): IRestoreAddressFromPrivateKeyResponse {
    try {
      const prvBuffer =
        privateKey.length > 65
          ? Buffer.from(privateKey.substring(2, 66), 'hex')
          : Buffer.from(privateKey, 'hex')
      const keyPair = ethereumWallet.fromPrivateKey(prvBuffer)
      const address = keyPair.getChecksumAddressString()
      return {
        address
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
