import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @Column()
  @IsString()
  @ApiProperty()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  salt: string;
}
