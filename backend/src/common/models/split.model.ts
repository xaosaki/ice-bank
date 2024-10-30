import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Transaction } from './transaction.model';
import { SplitPart } from './split-part.model';

@Table({
  tableName: 'splits',
  underscored: true,
  timestamps: false
})
export class Split extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true
  })
  splitId: string;

  @ForeignKey(() => Transaction)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  transactionId: string;

  @Column(DataType.STRING)
  transactionName: string;

  @Column(DataType.TEXT)
  transactionLogo: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  transactionDate: Date;

  @Column(DataType.TEXT)
  receipt: string | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false
  })
  amount: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  fromUserId: string;

  @Column({
    type: DataType.ENUM('Pending', 'Completed', 'Canceled'),
    allowNull: false,
    defaultValue: 'Pending'
  })
  status: string;

  @HasMany(() => SplitPart)
  users: SplitPart[];
}
