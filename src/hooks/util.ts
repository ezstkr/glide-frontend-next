class HttpRenponse extends Response {
    data: any
}

class HttpError extends Error {
    constructor(public response: HttpRenponse) {
        super()
    }
}

export function error_log(e: unknown): void {
  if (e instanceof HttpError && e.response) {
    console.log(e.response.status, e.response.statusText);
    console.log(e.response.data);
  } else {
    console.log(e);
  }
}