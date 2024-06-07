import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
export class TransferDto {
  @ApiProperty({
    description: 'fromPrivateKey',
    example: '0xprv'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string

  @ApiProperty({
    description: 'to',
    example: '0xaddress'
  })
  @IsNotEmpty({ message: 'to should not empty' })
  to: string

  @ApiProperty({
    description: 'amount',
    example: 0.0001
  })
  @IsNotEmpty({ message: 'should not empty' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'should be number' }
  )
  amount: number
}

export class RestoreAddressFromPrivateKeyDto {
  @ApiProperty({
    description: 'fromPrivateKey',
    example:
      '0xbee9e0fcc17b88415568154bd0c5d264fe5ef46d939ef85ae55999a5da09014b'
  })
  @IsNotEmpty({ message: 'fromPrivateKey should not empty' })
  fromPrivateKey: string
}

export class RestoreAddressFromMnemonicDto {
  @ApiProperty({
    description: 'mnemonic',
    example: 'mnemonic'
  })
  @IsNotEmpty({ message: 'mnemonic should not empty' })
  mnemonic: string
}
