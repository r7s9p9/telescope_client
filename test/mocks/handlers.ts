import { HttpResponse, http } from "msw";
import { serverRoute } from "../../src/shared/api/api.constants";
import { serverResponse } from "./constants";

export const resolver = (response: {
  body: object;
  init: { status: number };
}) => {
  return HttpResponse.json(response.body, response.init);
};

export const handlers = [
  http.post(serverRoute.auth.register, () =>
    resolver(serverResponse.auth.register),
  ),
  http.post(serverRoute.auth.login, () => resolver(serverResponse.auth.login)),
  http.post(serverRoute.auth.code, () => resolver(serverResponse.auth.code)),
  http.post(serverRoute.account.read, () =>
    resolver(serverResponse.account.read),
  ),
];
