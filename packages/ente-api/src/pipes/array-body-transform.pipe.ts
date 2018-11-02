import { PipeTransform, Injectable } from "@nestjs/common";

@Injectable()
export class ArrayBodyTransformPipe<T> implements PipeTransform<T | T[], T[]> {
  transform(value: T | T[]) {
    return Array.isArray(value) ? value : [value];
  }
}
