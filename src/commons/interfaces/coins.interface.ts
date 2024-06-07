export interface IGenerateAddress {
  mnemonic: string
  deriveIndex: number | null | undefined
  rpcUrl?: string
}

export interface IBalance {
  address: string
  contractAddress?: string
  rpcUrl: string
}

export interface IBalanceResponse {
  balance: number
}

export interface ITransactions {
  address: string
  contractAddress?: string | null | undefined | ''
  indexerUrl: string | null | undefined | ''
  rpcUrl?: string | null | undefined
  explorerUrl?: string | null | undefined | ''
  network?: string | null | undefined | ''
}

export interface ITransaction {
  transactionId: string
  indexerUrl: string
  rpcUrl?: string | null | undefined
  explorerUrl?: string | null | undefined | ''
  network?: string | null | undefined | ''
}

export interface ITransactionResponse {
  transactionUrl: string
  transactionId: string
  blockNumber: number
  timestamp: number
  value: number
  confirmations: number
  contractAddress?: string
  from: string
  to: string
  type?: 'send' | 'receive' | 'contractcall'
  error: boolean
}

export interface ITransactionsResponse {
  transactionUrl: string
  transactionId: string
  timestamp: number
  blockNumber: number
  value: number
  confirmations: number
  from: string
  to: string
  type: 'send' | 'receive' | 'contractcall'
  error: boolean
}

export interface IGenerateAddressResponse {
  address: string
  privateKey: string
}

export interface IRestoreAddressFromPrivateKey {
  privateKey: string
  rpcUrl?: string
}

export interface IRestoreAddressFromPrivateKeyResponse {
  address: string
}

export interface ITransfer {
  fromPrivateKey: string
  toAddress: string
  value: number
  contractAddress?: string | null | undefined
  rpcUrl: string
  explorerUrl?: string
}

export interface ITransferResponse {
  transactionId: string
  transactionUrl: string
}

export interface IGenerateTxParams {
  fromAddress: string
  toAddress: string
  value: number
  contractAddress?: string | null | undefined
  rpcUrl: string
}

export interface IPushRawTx {
  rawTx: string
  rpcUrl: string
  explorerUrl: string | null | undefined
}

export interface IPushRawTxResponse {
  transactionId: string
  transactionUrl: string
}

export interface IGenerateTxParamsResponse {
  nonce: string
  value: string
  data?: string | null | undefined
  gasLimit: string
  gasPrice: string
  to: string
}

export interface IEstimateFee {
  fromAddress: string
  toAddress: string
  value: number
  contractAddress?: string | null | undefined
  rpcUrl: string
}

export interface IEstimateFeeResponse {
  value: any
}

export interface IWallet {
  generateAddress: ({}: IGenerateAddress) =>
    | Promise<IGenerateAddressResponse>
    | IGenerateAddressResponse
  restoreAddressFromPrivateKey: ({}: IRestoreAddressFromPrivateKey) =>
    | Promise<IRestoreAddressFromPrivateKeyResponse>
    | IRestoreAddressFromPrivateKeyResponse
  balance: ({}: IBalance) => Promise<IBalanceResponse>
  transfer: ({}: ITransfer) => Promise<ITransferResponse>
  transactions: ({}: ITransactions) => Promise<ITransactionsResponse[]>
  transaction: ({}: ITransaction) => Promise<ITransactionResponse>
  estimateFee: ({}: IEstimateFee) => Promise<IEstimateFeeResponse>
  pushRawTx?: ({}: IPushRawTx) => Promise<IPushRawTxResponse>
  generateTxParams?: ({}: IGenerateTxParams) => Promise<IGenerateTxParamsResponse>
}
