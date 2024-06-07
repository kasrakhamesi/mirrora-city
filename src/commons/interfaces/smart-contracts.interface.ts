type AbiType = 'function' | 'constructor' | 'event' | 'fallback' | 'receive'
type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable'

interface AbiInput {
  name: string
  type: string
  indexed?: boolean
  components?: AbiInput[]
  internalType?: string
}

interface AbiOutput {
  name: string
  type: string
  components?: AbiOutput[]
  internalType?: string
}

export interface AbiItem {
  anonymous?: boolean
  constant?: boolean
  inputs?: AbiInput[]
  name?: string
  outputs?: AbiOutput[]
  payable?: boolean
  stateMutability?: StateMutabilityType
  type: AbiType
  gas?: number
}

export interface IReadContract {
  abi: AbiItem[]
  targetAbi: AbiItem
  contractAddress: string
  rpcUrl: string
  inputs: Array<any> | undefined | null
}

export interface IWriteContract {
  fromPrivateKey: string
  abi: AbiItem[]
  targetAbi?: AbiItem
  contractAddress: string
  rpcUrl: string
  inputs?: Array<any> | undefined | null | ''
  data?: null | undefined | '' | string
  value?: any
}

export interface IEstimateWriteContractFee {
  fromAddress: string
  abi: AbiItem[]
  targetAbi?: AbiItem
  contractAddress: string
  rpcUrl: string
  chainId: number
  inputs?: Array<any> | undefined | null | ''
  data?: null | undefined | '' | string
  value?: any
}

export interface IEstimateWriteContractFeeResponse {
  error: boolean
  value: number
  message: string
}

export interface IWriteContractResponse {
  transactionId: string
}

export interface ISmartContracts {
  readContract: ({}: IReadContract) => Promise<any>
  writeContract: ({}: IWriteContract) => Promise<IWriteContractResponse>
}
