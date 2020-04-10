import { Controller, Get, Param } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("hello/:name")
  helloWorld(@Param("name") name: string) {
    return `Hello, ${name}!`;
  }

  @Get("status")
  status() {
    return "OK";
  }
}
