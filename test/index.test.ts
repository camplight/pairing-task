import * as Server from "../src/server";

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

function testServerFunctionWithData(url: string, statusCode: number, contentType: string, message: any) {
  const request = {
    url,
    method: "GET",
  }

  const response = new ServerResponse();
  // @ts-ignore
  Server.serverFunction(request, response)

  expect(response.statusCode).toEqual(statusCode);
  expect(response.headers).toEqual({"Content-Type": contentType})
  expect(response.message).toEqual(message)
}

describe('tests data', () => {
  it.each([
      [
        'making a health check returns status 200',
        "/health",
        200,
        "text/plain",
        'OK',
      ],
      [
        'getting users',
        "/users",
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
          "/users/2",
          200,
          "application/json",
          JSON.stringify({ "id": "2", "name": "Bob" })
      ],
      [
      'getting non-existent user id',
          "/users/9999",
          404,
          "text/plain",
          'User not found'
      ]
  ])('%s', (_scenario: string, url: string, statusCode: number, contentType: string, message: any) => {
    testServerFunctionWithData(url, statusCode, contentType, message);
  });
})

function testServerFunctionWithoutData(url: string, statusCode: number, contentType: string, message: any) {
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
}

describe('tests with missing data', () => {
    it.each([
        [
            'getting users',
            '/users',
            500,
            "text/plain",
            'Internal Server Error',
        ],
        [
            'getting a user',
            '/users/1',
            500,
            "text/plain",
            'Internal Server Error',
        ]
    ])('%s', (_scenario: string, url: string, statusCode: number, contentType: string, message: any) => {
        testServerFunctionWithoutData(url, statusCode, contentType, message);
    });
});
