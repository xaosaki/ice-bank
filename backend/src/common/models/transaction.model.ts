import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Account } from './account.model';
import { Merchant } from './merchant.model';

@Table({
  tableName: 'transactions',
  underscored: true,
  timestamps: false
})
export class Transaction extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true
  })
  transactionId: string;

  @ForeignKey(() => Account)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  accountId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @ForeignKey(() => Merchant)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  merchantId: string | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  note: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  category: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  receipt: string | null;

  @BelongsTo(() => Merchant)
  merchant: Merchant;
}
