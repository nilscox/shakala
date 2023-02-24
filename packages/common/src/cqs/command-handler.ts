export interface CommandHandler<Deps, Command> {
  (dependencies: Deps, command: Command): Promise<void>;
}

export type CommandHandlerDependencies<Handler extends CommandHandler<never, never>> =
  Handler extends CommandHandler<infer Deps, never> ? Deps : never;

export type CommandHandlerCommand<Handler extends CommandHandler<never, never>> =
  Handler extends CommandHandler<never, infer Command> ? Command : never;
