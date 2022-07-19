/* istanbul ignore file */
class HttpException extends Error {
  status: number;

  code?: string;

  meta?: { target: string[] };

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export default HttpException;
