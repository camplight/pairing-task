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

export function testServerFunctionWithData(url: string, statusCode: number, contentType: string, message: any) {
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

export function testServerFunctionToReturn500Error(url: string, data: any) {
    const request = {
        url,
        method: "GET",
    }

    const response = new ServerResponse();
    // @ts-ignore
    Server.serverFunction(request, response, data);

    expect(response.statusCode).toEqual(500);
    expect(response.headers).toEqual({"Content-Type": "text/plain"})
    expect(response.message).toEqual('Internal Server Error');
}

export function testServerFunctionToReturn404Error(badRequest: any) {
    const response = new ServerResponse();
    // @ts-ignore
    Server.serverFunction(badRequest, response)

    expect(response.statusCode).toEqual(404);
    expect(response.headers).toEqual({"Content-Type": "text/plain"})
    expect(response.message).toEqual('Not Found')
}
