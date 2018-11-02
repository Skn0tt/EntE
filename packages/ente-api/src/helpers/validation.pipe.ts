import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

interface ValidationPipeConfig {
  array: boolean;
  arrayType: any;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(
    private readonly config: ValidationPipeConfig = {
      array: false,
      arrayType: null
    }
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (this.config.array) {
      return this.transformArray(value, this.config.arrayType);
    }

    const { metatype } = metadata;
    if (!metatype || !ValidationPipe.needsToBeValidated(metatype)) {
      return value;
    }

    const c = plainToClass(metatype, value);
    const errors = await validate(c, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }

  private async transformArray(values: any[], type: any) {
    const classes = values.map(v => plainToClass(type, v));
    const errors = await Promise.all(
      classes.map(
        async c =>
          await validate(c, {
            forbidNonWhitelisted: true,
            forbidUnknownValues: false
          })
      )
    );

    const realErrors = errors.filter(e => e.length > 0);
    if (realErrors.length > 0) {
      throw new BadRequestException(realErrors);
    }

    return classes;
  }

  static needsToBeValidated(metatype): boolean {
    const notNeeded = [String, Boolean, Number, Array, Object];
    const isNotNeeded = !!notNeeded.find(t => t === metatype);
    return !isNotNeeded;
  }
}
