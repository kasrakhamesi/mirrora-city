import { Module } from '@nestjs/common'
import { Erc20Service } from './erc20.service'
import { Erc20Controller } from './erc20.controller'
import { SmartContractsService } from '@packages/smart-contracts/smart-contracts.service'

@Module({
  controllers: [Erc20Controller],
  providers: [Erc20Service, SmartContractsService]
})
export class Erc20Module {}
