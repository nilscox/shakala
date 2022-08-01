export const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.constructor.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return JSON.stringify(error);
};
