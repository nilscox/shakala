export * from './register-handlers';

export * from './cqs/command-handler';
export * from './cqs/event-bus';
export * from './cqs/event-handler';
export * from './cqs/query-handler';

export * from './email/send-email.command';

export * from './interfaces/repositories';
export * from './interfaces/repository';
export * from './interfaces/logger.service';

export * from './thread/thread.in-memory-repository';
export * from './thread/comment.in-memory-repository';
export * from './thread/reaction.in-memory-repository';
export * from './user/user.in-memory-repository';

export * from './authentication/login.command';
export * from './authentication/signup.command';

export * from './thread/create-comment.command';
export * from './thread/create-thread.command';
export * from './thread/get-comment.query';
export * from './thread/get-last-threads.query';
export * from './thread/get-thread.query';
export * from './thread/set-reaction.command';
export * from './thread/edit-comment.command';

export * from './user/get-user-by-email.query';
export * from './user/get-user-by-id.query';
