import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class MintERC20Dto {
  @ApiProperty({
    description: 'fromPrivateKey',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string
}

export class BuyDto {
  @ApiProperty({
    description: 'tokenId',
    example: 1
  })
  @IsNotEmpty({ message: 'tokenId should not empty' })
  tokenId: number

  @ApiProperty({
    description: 'fromPrivateKey',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string
}

export class StartSaleDto {
  @ApiProperty({
    description: 'tokenId',
    example: 1
  })
  @IsNotEmpty({ message: 'tokenId should not empty' })
  tokenId: number

  @ApiProperty({
    description: 'price',
    example: 1
  })
  @IsNotEmpty({ message: 'price should not empty' })
  price: string

  @ApiProperty({
    description: 'fromPrivateKey',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string
}

export class StopSaleDto {
  @ApiProperty({
    description: 'tokenId',
    example: 1
  })
  @IsNotEmpty({ message: 'tokenId should not empty' })
  tokenId: number

  @ApiProperty({
    description: 'fromPrivateKey',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string
}

export class UpdatePriceDto {
  @ApiProperty({
    description: 'tokenId',
    example: 1
  })
  @IsNotEmpty({ message: 'tokenId should not empty' })
  tokenId: number

  @ApiProperty({
    description: 'price',
    example: 1
  })
  @IsNotEmpty({ message: 'price should not empty' })
  price: string

  @ApiProperty({
    description: 'fromPrivateKey',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string
}
