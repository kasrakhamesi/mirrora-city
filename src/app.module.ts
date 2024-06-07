import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@modules/auth/auth.module'
import { MirroraModule } from '@modules/mirrora/mirrora.module'
import { Erc20Module } from '@modules/erc20/erc20.module'
import { WalletModule } from '@modules/wallet/wallet.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    Erc20Module,
    WalletModule,
    MirroraModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
