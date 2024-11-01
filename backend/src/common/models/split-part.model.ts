import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Split } from './split.model';

@Table({
  tableName: 'split_parts',
  underscored: true,
  timestamps: false
})
export class SplitPart extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true
  })
  partId: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Split)
  @Column(DataType.UUID)
  splitId: string;

  @BelongsTo(() => Split)
  split: Split;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false
  })
  amount: number;

  @Column({
    type: DataType.ENUM('Accepted', 'Declined', 'Pending', 'Canceled'),
    allowNull: false,
    defaultValue: 'Pending'
  })
  status: string;

  @Column(DataType.TEXT)
  comment: string | null;
}
