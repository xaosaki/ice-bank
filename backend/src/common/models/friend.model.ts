import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'friends',
  timestamps: false,
  underscored: true
})
export class Friend extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true
  })
  userId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true
  })
  friendUserId: string;

  @BelongsTo(() => User, 'friendUserId')
  friend: User;
}
