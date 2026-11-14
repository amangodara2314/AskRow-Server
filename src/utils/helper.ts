function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : `Something went wrong, Error: ${error}`;
}

export { getErrorMessage };
