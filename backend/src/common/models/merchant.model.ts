import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Transaction } from './transaction.model';

@Table({
  tableName: 'merchants',
  underscored: true,
  timestamps: false
})
export class Merchant extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true
  })
  merchantId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  logo: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  mcc: number | null;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
