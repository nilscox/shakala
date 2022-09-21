import { BlobType, Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ProfileImageType } from 'backend-domain';

import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'profile_image' })
export class SqlProfileImage {
  @PrimaryKey()
  name!: string;

  @Enum(() => ProfileImageType)
  type!: ProfileImageType;

  @Property({ type: BlobType })
  data!: Buffer;

  @ManyToOne()
  user!: SqlUser;

  @Property({ columnType: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ columnType: 'timestamp', onUpdate: () => new Date() })
  updatedAt = new Date();
}
