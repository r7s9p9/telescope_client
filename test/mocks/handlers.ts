import { HttpResponse, http } from "msw";
import { serverRoute } from "../../src/shared/api/api.constants";
import { serverResponse } from "./constants";

const resolver = (response: { body: object; init: { status: number } }) => {
  return HttpResponse.json(response.body, response.init);
};

export const handlers = [
  http.post(serverRoute.test[401], () => {
    return HttpResponse.json({}, { status: 401 });
  }),
  http.post(serverRoute.test[403], () => {
    return HttpResponse.json({}, { status: 403 });
  }),
  http.post(serverRoute.test[404], () => {
    return HttpResponse.json({}, { status: 404 });
  }),
  http.post(serverRoute.test[500], () => {
    return HttpResponse.json({}, { status: 500 });
  }),
  http.post(serverRoute.test.empty, () => {
    return HttpResponse.json({});
  }),
  http.post(serverRoute.test.null, () => {
    return new HttpResponse(null);
  }),
  http.post(serverRoute.auth.register, () =>
    resolver(serverResponse.auth.register),
  ),
  http.post(serverRoute.auth.login, () => resolver(serverResponse.auth.login)),
  http.post(serverRoute.auth.code, () => resolver(serverResponse.auth.code)),
  http.post(serverRoute.account.read, () =>
    resolver(serverResponse.account.read),
  ),
];
