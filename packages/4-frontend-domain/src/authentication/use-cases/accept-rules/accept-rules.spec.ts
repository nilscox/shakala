import { TestStore } from '../../../test';
import { setAcceptRulesWarningVisible, setRulesAccepted } from '../../authentication.actions';
import { selectAreRulesAccepted, selectIsAcceptRulesWarningVisible } from '../../authentication.selectors';

import { acceptRules } from './accept-rules';

describe('acceptRules', () => {
  const store = new TestStore();

  it('displays a warning the first time the user accepts the rules', () => {
    expect(store.select(selectIsAcceptRulesWarningVisible)).toBe(false);
    expect(store.select(selectAreRulesAccepted)).toBe(false);

    store.dispatch(acceptRules(true));

    expect(store.select(selectIsAcceptRulesWarningVisible)).toBe(true);
    expect(store.select(selectAreRulesAccepted)).toBe(false);
  });

  it('displays a warning the first time the user accepts the rules', () => {
    store.dispatch(setAcceptRulesWarningVisible(true));

    store.dispatch(acceptRules(true));

    expect(store.select(selectIsAcceptRulesWarningVisible)).toBe(true);
    expect(store.select(selectAreRulesAccepted)).toBe(true);
  });

  it('unsets the accept rules flag', () => {
    store.dispatch(setAcceptRulesWarningVisible(true));
    store.dispatch(setRulesAccepted(true));

    store.dispatch(acceptRules(false));

    expect(store.select(selectIsAcceptRulesWarningVisible)).toBe(true);
    expect(store.select(selectAreRulesAccepted)).toBe(false);
  });
});
