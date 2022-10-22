import { createAuthUser, createComment, createUser, TestStore } from '../test';

import { addComment, addComments, setCommentEdited } from './comments.actions';
import {
  selectFormattedCommentDate,
  selectFormattedCommentDateDetailed,
  selectIsAuthUserAuthor,
  selectParentComment,
} from './comments.selectors';

describe('comments selectors', () => {
  const store = new TestStore();

  describe('selectFormattedCommentDate', () => {
    const comment = createComment({
      date: new Date('2016-07-16T14:58:00').toISOString(),
    });

    beforeEach(() => {
      store.dispatch(addComment(comment));
    });

    it('returns the formatted comment date', () => {
      expect(store.select(selectFormattedCommentDate, comment.id)).toEqual('Le 16 juillet 2016');
    });

    it('appends a * when the comment was edited', () => {
      store.dispatch(setCommentEdited(comment.id, new Date().toISOString()));

      expect(store.select(selectFormattedCommentDate, comment.id)).toEqual('Le 16 juillet 2016 *');
    });
  });

  describe('selectFormattedCommentDateDetailed', () => {
    const comment = createComment({
      date: new Date('2016-07-16T14:58:00').toISOString(),
    });

    beforeEach(() => {
      store.dispatch(addComment(comment));
    });

    it('returns the formatted comment date', () => {
      expect(store.select(selectFormattedCommentDateDetailed, comment.id)).toEqual(
        'Le 16 juillet 2016 à 14:58',
      );
    });

    it('appends a * when the comment was edited', () => {
      store.dispatch(setCommentEdited(comment.id, new Date().toISOString()));

      expect(store.select(selectFormattedCommentDateDetailed, comment.id)).toEqual(
        'Le 16 juillet 2016 à 14:58 (édité)',
      );
    });
  });

  describe('selectParentComment', () => {
    const reply = createComment();
    const parent = createComment({ replies: [reply] });

    beforeEach(() => {
      store.dispatch(addComments([parent, reply]));
    });

    it('returns undefined when the comment has no parent', () => {
      expect(store.select(selectParentComment, parent.id)).toBe(undefined);
    });

    it("returns a reply's parent comment", () => {
      expect(store.select(selectParentComment, reply.id)).toEqual(parent);
    });
  });

  describe('selectIsAuthUserAuthor', () => {
    const author = createUser();
    const comment = createComment({ author });

    beforeEach(() => {
      store.dispatch(addComment(comment));
    });

    it('returns true when the authenticated user is the author of the comment', () => {
      store.user = createAuthUser(author);
      expect(store.select(selectIsAuthUserAuthor, comment.id)).toBe(true);
    });

    it('returns false when the user is not authenticated', () => {
      expect(store.select(selectIsAuthUserAuthor, comment.id)).toBe(false);
    });

    it('returns false when the authenticated user is not the author of the comment', () => {
      store.user = createAuthUser();
      expect(store.select(selectIsAuthUserAuthor, comment.id)).toBe(false);
    });
  });
});
