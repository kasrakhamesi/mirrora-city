import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  index(): object {
    return { message: 'Welcome To HD-Wallet Service', version: 1 }
  }
}
