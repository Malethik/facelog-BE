import debug from "debug";
/* eslint-disable no-unused-vars */
debug("Starting HttpError");
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusMessage: string,
    message?: string,
    options?: ErrorOptions
  ) {
    super(message);
    this.status = status;
  }
}
