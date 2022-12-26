import { BaseError } from '../libs';

export class InvalidImageFormat extends BaseError<{ type: string; allowedTypes: string[] }> {
  status = 400;

  constructor(details: { type: string; allowedTypes: string[] }) {
    super("the image's mime type is not recognized", details);
  }
}
