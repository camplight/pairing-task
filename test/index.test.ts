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

function testServerFunctionWithData(request: any, statusCode: number, contentType: string, message: any) {
  const response = new ServerResponse();
  // @ts-ignore
  Server.serverFunction(request, response)

  expect(response.statusCode).toEqual(statusCode);
  expect(response.headers).toEqual({"Content-Type": contentType})
  expect(response.message).toEqual(message)
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
      ],
      [
        'getting users',
        {
          url: "/users",
          method: "GET",
        },
        200,
        "application/json",
        JSON.stringify({
          "users": [
            { "id": "1", "name": "Alice" },
            { "id": "2", "name": "Bob" }
          ]
        })
      ],
      [
      'getting one particular user by id',
          {
            url: "/users/2",
            method: "GET",
          },
          200,
          "application/json",
          JSON.stringify({ "id": "2", "name": "Bob" })
      ]
  ])('%s', (_scenario: string, request: any, statusCode: number, contentType: string, message: any) => {
    testServerFunctionWithData(request, statusCode, contentType, message);
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
