import { UserActivityType } from '@shakala/shared';

import { ActivityItem } from '../user-activity';

import { CommentEditedActivity } from './comment-edited-activity';
import { CommentReactionSetActivity } from './comment-reaction-set-activity';
import { CommentReportedActivity } from './comment-reported-activity';
import { EmailAddressValidatedActivity } from './email-address-validated-activity';
import { ProfileImageChangedActivity } from './profile-image-changed-activity';
import { ReplyCreatedActivity } from './reply-created-activity';
import { RootCommentCreatedActivity } from './root-comment-created-activity';
import { SignInActivity } from './sign-in-activity';
import { SignOutActivity } from './sign-out-activity';
import { SignUpActivity } from './sign-up-activity';
import { ThreadCreatedActivity } from './thread-created-activity';

export const activityComponentMap: { [Type in UserActivityType]: ActivityItem<Type> } = {
  [UserActivityType.signUp]: SignUpActivity,
  [UserActivityType.signIn]: SignInActivity,
  [UserActivityType.signOut]: SignOutActivity,
  [UserActivityType.emailAddressValidated]: EmailAddressValidatedActivity,
  [UserActivityType.profileImageChanged]: ProfileImageChangedActivity,
  [UserActivityType.threadCreated]: ThreadCreatedActivity,
  [UserActivityType.rootCommentCreated]: RootCommentCreatedActivity,
  [UserActivityType.replyCreated]: ReplyCreatedActivity,
  [UserActivityType.commentEdited]: CommentEditedActivity,
  [UserActivityType.commentReactionSet]: CommentReactionSetActivity,
  [UserActivityType.commentReported]: CommentReportedActivity,
};
