import { Injectable } from '@nestjs/common'

@Injectable()
export class ApiKeyService {
  constructor() {}

  async validateApiKey(key: string): Promise<boolean> {
    return key === '123456'
  }
}
