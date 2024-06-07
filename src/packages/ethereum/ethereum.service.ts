import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import ethereumWallet, { hdkey } from 'ethereumjs-wallet'
import {
  IGenerateAddressResponse,
  IGenerateAddress,
  IWallet,
  IRestoreAddressFromPrivateKey,
  IRestoreAddressFromPrivateKeyResponse,
  ITransfer,
  ITransferResponse,
  ITransactions,
  ITransactionsResponse,
  ITransaction,
  ITransactionResponse,
  IBalance,
  IBalanceResponse,
  IEstimateFee,
  IEstimateFeeResponse,
  IGenerateTxParams,
  IGenerateTxParamsResponse,
  IPushRawTx,
  IPushRawTxResponse
} from '@commons/interfaces/coins.interface'
import Web3 from 'web3'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import Erc20Abi from '@commons/abis/erc20.abi'
const bip39 = require('bip39')

@Injectable()
export class EthereumService implements IWallet {
  private readonly historicalBlocks = 4
  public async generateAddress({
    mnemonic,
    deriveIndex = 0
  }: IGenerateAddress): Promise<IGenerateAddressResponse> {
    try {
      const seed = await bip39.mnemonicToSeed(mnemonic)
      const hdwallet = hdkey.fromMasterSeed(seed)
      const path = `m/44'/60'/0'/0/${deriveIndex}`
      const wallet = hdwallet.derivePath(path).getWallet()
      const address = wallet.getChecksumAddressString()
      const privateKey = wallet.getPrivateKeyString()
      return {
        address,
        privateKey
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
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
  public async balance({
    address,
    contractAddress,
    rpcUrl
  }: IBalance): Promise<IBalanceResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
      const lastBlack = await web3.eth.getBlockNumber()
      if (lastBlack < 0)
        throw new HttpException(
          'Network Service Temporarily Disable',
          HttpStatus.BAD_REQUEST
        )

      if (!contractAddress) {
        const balance = await web3.eth.getBalance(address)
        return {
          balance: Number(balance)
        }
      }

      type ABI = readonly [
        {
          constant: true
          inputs: [{ name: '_owner'; type: 'address' }]
          name: 'balanceOf'
          outputs: [{ name: 'balance'; type: 'uint256' }]
          type: 'function'
        }
      ]

      const abi = Erc20Abi as unknown as ABI
      const contract = new web3.eth.Contract(abi, contractAddress)
      const balance = await contract.methods.balanceOf(address).call()

      return { balance: Number(balance) }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  public async transfer({
    fromPrivateKey,
    toAddress,
    value,
    contractAddress,
    rpcUrl,
    explorerUrl
  }: ITransfer): Promise<ITransferResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const from = this.restoreAddressFromPrivateKey({
        privateKey: fromPrivateKey
      })
      const nonce = await web3.eth.getTransactionCount(from.address, 'pending')

      let data = '0x'

      //const gas = await this.gasStation(rpcUrl)

      const newValue = contractAddress ? BigInt(0) : BigInt(value)

      let gasLimit = BigInt(0)
      if (contractAddress) {
        type ABI = readonly [
          {
            constant: false
            inputs: [
              {
                name: '_to'
                type: 'address'
              },
              {
                name: '_value'
                type: 'uint256'
              }
            ]
            name: 'transfer'
            outputs: [
              {
                name: ''
                type: 'bool'
              }
            ]
            type: 'function'
          }
        ]

        const abi = Erc20Abi as unknown as ABI

        const contract = new web3.eth.Contract(abi, contractAddress)
        data = contract.methods.transfer(toAddress, BigInt(value)).encodeABI()

        gasLimit = await contract.methods
          .transfer(toAddress, BigInt(value))
          .estimateGas({
            from: from.address
          })
      } else {
        gasLimit = await web3.eth.estimateGas({
          from: from.address,
          to: toAddress,
          nonce,
          data,
          value: newValue
        })
      }

      const gasPrice = await web3.eth.getGasPrice()
      const chainId = await web3.eth.getChainId()

      const txParams = contractAddress
        ? {
            nonce,
            chainId,
            //type: 2,
            //maxFeePerGas: BigInt(gas.maxFeePerGas),
            //maxPriorityFeePerGas: BigInt(gas.maxPriorityFeePerGas),
            value: newValue,
            data,
            gasLimit,
            gasPrice: BigInt(gasPrice),
            to: contractAddress
          }
        : {
            nonce,
            chainId,
            //type: 2,
            //maxFeePerGas: gas.maxFeePerGas,
            //maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
            value: newValue,
            gasLimit,
            gasPrice: BigInt(gasPrice),
            to: toAddress
          }

      const rawTransaction = await web3.eth.accounts.signTransaction(
        txParams,
        fromPrivateKey
      )

      const transactionResult = await web3.eth.sendSignedTransaction(
        rawTransaction?.rawTransaction
      )

      return {
        transactionId: String(transactionResult?.transactionHash),
        transactionUrl: `${explorerUrl}/${transactionResult?.transactionHash}`
      }
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  public async pushRawTx({
    rawTx,
    rpcUrl,
    explorerUrl
  }: IPushRawTx): Promise<IPushRawTxResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const transactionResult = await web3.eth.sendSignedTransaction(rawTx)

      return {
        transactionId: String(transactionResult?.transactionHash),
        transactionUrl: `${explorerUrl}/${transactionResult?.transactionHash}`
      }
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  public async generateTxParams({
    fromAddress,
    toAddress,
    value,
    contractAddress,
    rpcUrl
  }: IGenerateTxParams): Promise<IGenerateTxParamsResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending')

      let data = '0x'

      const newValue = contractAddress ? BigInt(0) : BigInt(value)

      let gasLimit = BigInt(0)
      if (contractAddress) {
        type ABI = readonly [
          {
            constant: false
            inputs: [
              {
                name: '_to'
                type: 'address'
              },
              {
                name: '_value'
                type: 'uint256'
              }
            ]
            name: 'transfer'
            outputs: [
              {
                name: ''
                type: 'bool'
              }
            ]
            type: 'function'
          }
        ]

        const abi = Erc20Abi as unknown as ABI

        const contract = new web3.eth.Contract(abi, contractAddress)
        data = contract.methods.transfer(toAddress, BigInt(value)).encodeABI()

        gasLimit = await contract.methods
          .transfer(toAddress, BigInt(value))
          .estimateGas({
            from: fromAddress
          })
      } else {
        gasLimit = await web3.eth.estimateGas({
          from: fromAddress,
          to: toAddress,
          nonce,
          data,
          value: newValue
        })
      }

      const gasPrice = await web3.eth.getGasPrice()
      const chainId = await web3.eth.getChainId()

      const txParams = contractAddress
        ? {
            nonce: web3.utils.toHex(nonce),
            chainId: web3.utils.toHex(chainId),
            value: web3.utils.toHex(newValue),
            data,
            gasLimit: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(BigInt(gasPrice)),
            to: contractAddress
          }
        : {
            nonce: web3.utils.toHex(nonce),
            chainId: web3.utils.toHex(chainId),
            value: web3.utils.toHex(newValue),
            gasLimit: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(BigInt(gasPrice)),
            to: toAddress
          }

      return txParams
    } catch (e) {
      throw new HttpException(
        e?.reason || e?.message || e,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  public async transactions({
    address,
    contractAddress,
    indexerUrl,
    rpcUrl,
    explorerUrl,
    network
  }: ITransactions): Promise<ITransactionsResponse[]> {
    try {
      const url = contractAddress
        ? `${indexerUrl}/network/${network}/address/${address}/contract-txs/${contractAddress}`
        : `${indexerUrl}/network/${network}/address/${address}/basic-txs`

      const { data } = await axios({
        method: 'get',
        url,
        headers: {
          'content-type': 'application/json'
        }
      })

      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
      const lastBlack = await web3.eth.getBlockNumber()
      if (lastBlack < 0)
        throw new HttpException(
          'Network Service Temporarily Disable',
          HttpStatus.BAD_REQUEST
        )

      return data.data.map((item: any) => {
        return {
          transactionId: item?._id || item?.id,
          transactionUrl: `${explorerUrl}/${item?._id || item?.id}`,
          blockNumber: item.blockNumber,
          timestamp: parseInt(item.timestamp),
          value: parseFloat(item?.contract?.value || item.value),
          from: item.from,
          to: item?.contract?.to || item.to,
          confirmations: Number(lastBlack) - Number(item.blockNumber),
          type:
            item.from.toLowerCase() === address.toLowerCase()
              ? 'send'
              : 'receive',
          error: item.error === '' ? false : true
        }
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  public async transaction({
    transactionId,
    indexerUrl,
    rpcUrl,
    explorerUrl,
    network
  }: ITransaction): Promise<ITransactionResponse> {
    try {
      const url = `${indexerUrl}/network/${network}/transaction/${transactionId}`

      const { data } = await axios({
        method: 'get',
        url,
        headers: {
          'content-type': 'application/json'
        }
      })

      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
      const lastBlack = await web3.eth.getBlockNumber()
      if (lastBlack < 0)
        throw new HttpException(
          'Network Service Temporarily Disable',
          HttpStatus.BAD_REQUEST
        )

      const transaction = data.data
      return {
        transactionId: transaction._id,
        transactionUrl: `${explorerUrl}/${transaction?._id || transaction?.id}`,
        blockNumber: transaction.blockNumber,
        timestamp: parseInt(transaction.timestamp),
        value: parseFloat(transaction?.contract?.value || transaction.value),
        confirmations: Number(lastBlack) - Number(transaction.blockNumber),
        contractAddress: transaction?.contract?.address || null,
        from: transaction.from,
        to: transaction?.contractAddress?.to || transaction.to,
        error: transaction.error === '' ? false : true
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  public async estimateFee({
    fromAddress,
    toAddress,
    value,
    contractAddress,
    rpcUrl
  }: IEstimateFee): Promise<IEstimateFeeResponse> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending')

      let data = '0x'
      let gasLimit = BigInt(0)
      const newValue = contractAddress ? BigInt(0) : BigInt(value)
      if (contractAddress) {
        type ABI = [
          {
            constant: false
            inputs: [
              {
                name: '_to'
                type: 'address'
              },
              {
                name: '_value'
                type: 'uint256'
              }
            ]
            name: 'transfer'
            outputs: [
              {
                name: ''
                type: 'bool'
              }
            ]
            type: 'function'
          }
        ]

        const abi = Erc20Abi as unknown as ABI

        const contract = new web3.eth.Contract(abi, contractAddress)
        data = contract.methods.transfer(toAddress, BigInt(value)).encodeABI()

        gasLimit = await contract.methods
          .transfer(toAddress, BigInt(value))
          .estimateGas({
            from: fromAddress
          })
      } else {
        gasLimit = await web3.eth.estimateGas({
          from: fromAddress,
          to: toAddress,
          nonce,
          data,
          value: newValue
        })
      }

      const gasPrice = await web3.eth.getGasPrice()

      const networkFee = new BigNumber(gasPrice.toString()).multipliedBy(
        gasLimit.toString()
      )

      const networkFeeEther = networkFee.dividedBy(new BigNumber('1e18'))

      return { value: Number(networkFeeEther) }
    } catch (e) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST)
    }
  }

  // utils
  private gasStation = async (rpcUrl: string) => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

      const blockData = await web3.eth.getFeeHistory(
        this.historicalBlocks,
        'latest',
        [25, 50, 75]
      )

      const blocks = this.formatFeeHistory(blockData, false)

      const slow = this.avg(
        blocks
          .filter((b) => b.priorityFeePerGas)
          .map((b) => b.priorityFeePerGas[0])
      )

      const average = this.avg(
        blocks
          .filter((b) => b.priorityFeePerGas)
          .map((b) => b.priorityFeePerGas[1])
      )
      const fast = this.avg(
        blocks
          .filter((b) => b.priorityFeePerGas)
          .map((b) => b.priorityFeePerGas[2])
      )

      const block = await web3.eth.getBlock('pending')
      const baseFeePerGas = Number(block.baseFeePerGas)

      const gas = {
        slow: parseInt(
          web3.utils.fromWei(Number(slow + baseFeePerGas).toString(), 'gwei')
        ),
        average: parseInt(
          web3.utils.fromWei(Number(average + baseFeePerGas).toString(), 'gwei')
        ),
        fast: parseInt(
          web3.utils.fromWei(
            Number(fast + baseFeePerGas + 1).toString(),
            'gwei'
          )
        )
      }

      const maxFeePerGas = BigInt(gas.average)

      const maxPriorityFee = Number(gas.average) <= 3 ? BigInt(1) : BigInt(3)

      const maxPriorityFeePerGas = BigInt(maxPriorityFee)

      return {
        maxFeePerGas,
        maxPriorityFeePerGas
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  private formatFeeHistory = (result: any, includePending = true) => {
    let blockNum = Number(result.oldestBlock)
    let index = 0
    const blocks = []
    while (blockNum < Number(result.oldestBlock) + this.historicalBlocks) {
      blocks.push({
        number: blockNum,
        baseFeePerGas: Number(result.baseFeePerGas[index]),
        gasUsedRatio: Number(result.gasUsedRatio[index]),
        priorityFeePerGas:
          result.reward &&
          result.reward[index] &&
          result.reward[index].map((x: any) => Number(x))
      })
      blockNum += 1
      index += 1
    }
    if (includePending) {
      blocks.push({
        number: 'pending',
        baseFeePerGas: Number(result.baseFeePerGas[this.historicalBlocks]),
        gasUsedRatio: NaN,
        priorityFeePerGas: []
      })
    }
    return blocks
  }

  private avg = (arr: any) => {
    const sum = arr.reduce((a: any, v: any) => a + v)
    return Math.round(sum / arr.length)
  }
}
