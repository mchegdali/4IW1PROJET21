class InvalidTokenFormatError extends Error {
  /**
   *  @param {string} [message]
   * */
  constructor(message = 'Invalid token format') {
    super();
    this.name = 'InvalidTokenFormatError';
    this.message = message;
  }
}

export default InvalidTokenFormatError;
