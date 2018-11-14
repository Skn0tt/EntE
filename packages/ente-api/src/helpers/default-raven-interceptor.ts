import { RavenInterceptor } from "nest-raven";
import { HttpException } from "@nestjs/common";

export const DefaultRavenInterceptor = RavenInterceptor({
  filters: [
    {
      type: HttpException,
      filter: (exc: HttpException) => 500 > exc.getStatus()
    }
  ]
});
