import useToast from "@/hooks/useToast";


class HttpRenponse extends Response {
    data: any
}

class HttpError extends Error {
    constructor(public response: HttpRenponse) {
        super()
    }
}

function error_log(e: unknown): void {
  if (e instanceof HttpError && e.response) {
    console.log(e.response.status, e.response.statusText);
    console.log(e.response.data);
  } else {
    console.log(e);
  }
}


async function error_can_happen(func: Function) {
  try {
      return await func()
  } catch(e) {
      error_log(e)
      if (typeof document === 'undefined') return e
      return e
  }
}


export { error_log, error_can_happen }