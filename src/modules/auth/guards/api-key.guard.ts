import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiKeyService } from '../services/api-key.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.header('x-api-key')

    if (!apiKey) {
      return false
    }

    return await this.apiKeyService.validateApiKey(apiKey)
  }
}
