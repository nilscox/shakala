export interface EntityMapper<SqlEntity, Entity> {
  toSql(sqlEntity: Entity): SqlEntity;
  fromSql(sqlEntity: SqlEntity): Entity;
}
