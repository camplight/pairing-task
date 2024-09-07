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
      ],
      [
      'getting non-existent user id',
          {
            url: "/users/9999",
            method: "GET",
          },
          404,
          "text/plain",
          'User not found'
      ]
  ])('%s', (_scenario: string, request: any, statusCode: number, contentType: string, message: any) => {
    testServerFunctionWithData(request, statusCode, contentType, message);
  });

  it.each([
      [
          'getting users',
          '/users',
          500,
          "text/plain",
          'Internal Server Error',
      ]
  ])('%s', (_scenario: string, url: string, statusCode: number, contentType: string, message: any) => {
    const request = {
      url,
      method: "GET",
    }

    const response = new ServerResponse();
    // @ts-ignore
    Server.serverFunction(request, response, '');

    expect(response.statusCode).toEqual(statusCode);
    expect(response.headers).toEqual({"Content-Type": contentType})
    expect(response.message).toEqual(message);
  });
})
