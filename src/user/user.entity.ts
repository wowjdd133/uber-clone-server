import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  //bcrypt 사용해서 salt 필요없어짐.. 다음에 쓰는걸로 또 만들어보자
  @Column()
  salt: string;
}
