import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'blacklist_tokens', underscored: true, timestamps: false })
export class BlacklistToken extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    primaryKey: true
  })
  token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiresAt: Date;
}
