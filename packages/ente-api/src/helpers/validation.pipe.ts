import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

interface ValidationPipeConfig {
  array: boolean;
  type: any;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(
    private readonly config: ValidationPipeConfig = {
      array: false,
      type: null
    }
  ) {}

  async transform(value: any) {
    const { array, type } = this.config;

    if (array) {
      return this.transformArray(value, type);
    }

    const c = plainToClass(type, value);
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
}
