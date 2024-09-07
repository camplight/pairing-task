import * as Server from "../src/server";
import * as fs from 'fs';
import {readFileSync} from "fs";

class ServerResponse {
  public statusCode: number = 0;
  public headers: any;
  public message: string = '';

  public writeHead(statusCode: number, headers: any) {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  public end(message: string) {
    this.message = message;
  }
}

describe('main test', () => {
  it.each([
      [
        'making a health check returns status 200',
        {
          url: "/health",
          method: "GET",
        },
        200,
        "text/plain",
        'OK',
      ]
  ])('%s', (_scenario: string, request: any, statusCode: number, contentType: string, message: any) => {
    const response = new ServerResponse();
    // @ts-ignore
    Server.serverFunction(request, response)

    expect(response.statusCode).toEqual(statusCode);
    expect(response.headers).toEqual({"Content-Type": contentType})
    expect(response.message).toEqual(message)
  });

  it('when getting users', () => {
    const request = {
      url: "/users",
      method: "GET",
    }
    const response = new ServerResponse();
    // @ts-ignore
    Server.serverFunction(request, response)
    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({"Content-Type": "application/json"})
    expect(response.message).toEqual(JSON.stringify({
      "users": [
        { "id": "1", "name": "Alice" },
        { "id": "2", "name": "Bob" }
      ]
    }));
  });

  it('when getting users and there is no data', () => {
    const request = {
      url: "/users",
      method: "GET",
    }
    const response = new ServerResponse();
    // @ts-ignore
    Server.serverFunction(request, response, '');
    expect(response.statusCode).toEqual(500);
    expect(response.headers).toEqual({"Content-Type": "text/plain"})
    expect(response.message).toEqual('Internal Server Error');
  });
})
