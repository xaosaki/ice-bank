import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'accounts',
  underscored: true
})
export class Account extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true
  })
  accountId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  })
  balance: number;

  @Column({
    type: DataType.ENUM('CAD', 'USD'),
    allowNull: false,
    defaultValue: 'CAD'
  })
  currency: 'CAD' | 'USD';
}
