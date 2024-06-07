import { Module } from '@nestjs/common'
import { ApiKeyService } from './services/api-key.service'

@Module({
  imports: [],
  providers: [ApiKeyService],
  exports: [ApiKeyService]
})
export class AuthModule {}
