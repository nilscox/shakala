import { AnyAction } from 'redux';

export const createEntityAction = <Type extends string, Entity, Params extends unknown[]>(
  type: Type,
  updater: (entity: Entity, ...params: Params) => Entity,
) => {
  type Action = {
    type: Type;
    entityId: string;
    params: Params;
  };

  const action = (entityId: string, ...params: Params): Action => ({
    type,
    entityId,
    params,
  });

  action.isAction = (action: AnyAction): action is Action => {
    return action.type === type;
  };

  action.reducer = (entities: Record<string, Entity>, action: AnyAction) => {
    if (action.type !== type || !entities[action.entityId]) {
      return entities;
    }

    return {
      ...entities,
      [action.entityId]: updater(entities[action.entityId], ...action.params),
    };
  };

  return action;
};
