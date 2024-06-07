import { Module } from '@nestjs/common'
import { MirroraService } from './mirrora.service'
import { MirroraController } from './mirrora.controller'
import { SmartContractsService } from '@packages/smart-contracts/smart-contracts.service'

@Module({
  imports: [],
  controllers: [MirroraController],
  providers: [MirroraService, SmartContractsService]
})
export class MirroraModule {}
