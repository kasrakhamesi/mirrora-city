import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class TransferDto {
  @ApiProperty({
    description: 'The private key of the sender',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'Private key should not be empty' })
  fromPrivateKey: string

  @ApiProperty({
    description: 'The recipient address',
    example: '0xRecipientAddress'
  })
  @IsNotEmpty({ message: 'Recipient address should not be empty' })
  to: string

  @ApiProperty({
    description: 'The amount to transfer',
    example: '1000'
  })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  amount: string
}

export class ApproveDto {
  @ApiProperty({
    description: 'The private key of the owner',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'Private key should not be empty' })
  fromPrivateKey: string

  @ApiProperty({
    description: 'The address to approve',
    example: '0xSpenderAddress'
  })
  @IsNotEmpty({ message: 'Spender address should not be empty' })
  spender: string

  @ApiProperty({
    description: 'The amount to approve',
    example: '1000'
  })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  amount: string
}

export class DecreaseAllowanceDto {
  @ApiProperty({
    description: 'The private key of the owner',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'Private key should not be empty' })
  fromPrivateKey: string

  @ApiProperty({
    description: 'The address of the spender',
    example: '0xSpenderAddress'
  })
  @IsNotEmpty({ message: 'Spender address should not be empty' })
  spender: string

  @ApiProperty({
    description: 'The amount to decrease the allowance by',
    example: '100'
  })
  @IsNotEmpty({ message: 'Subtracted value should not be empty' })
  subtractedValue: string
}

export class IncreaseAllowanceDto {
  @ApiProperty({
    description: 'The private key of the owner',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'Private key should not be empty' })
  fromPrivateKey: string

  @ApiProperty({
    description: 'The address of the spender',
    example: '0xSpenderAddress'
  })
  @IsNotEmpty({ message: 'Spender address should not be empty' })
  spender: string

  @ApiProperty({
    description: 'The amount to increase the allowance by',
    example: '100'
  })
  @IsNotEmpty({ message: 'Added value should not be empty' })
  addedValue: string
}

export class TransferFromDto {
  @ApiProperty({
    description: 'The private key of the sender',
    example: '0xprvkey'
  })
  @IsNotEmpty({ message: 'Private key should not be empty' })
  fromPrivateKey: string

  @ApiProperty({
    description: 'The address of the original owner of the tokens',
    example: '0xFromAddress'
  })
  @IsNotEmpty({ message: 'From address should not be empty' })
  from: string

  @ApiProperty({
    description: 'The recipient address',
    example: '0xToAddress'
  })
  @IsNotEmpty({ message: 'Recipient address should not be empty' })
  to: string

  @ApiProperty({
    description: 'The amount to transfer',
    example: '1000'
  })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  amount: string
}
