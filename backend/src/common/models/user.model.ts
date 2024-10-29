import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  underscored: true
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  passwordHash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  middleName: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true
  })
  phone: string | null;

  toDTO() {
    const { passwordHash, createdAt, updatedAt, ...userDTO } = this.get();
    return userDTO;
  }
}
