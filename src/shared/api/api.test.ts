import { describe, expect, test } from "vitest";
import { useQuery } from "./api";
import { serverRoute, readAccountBody } from "./api.constants";
import { accountReadSchema } from "./api.schema";
import { customRenderHook } from "../../../test/render";
import { serverResponse } from "../../../test/mocks/constants";

describe("useQuery", () => {
  test("should call fetch with correct arguments", async () => {
    const route = serverRoute.account.read;
    const body = readAccountBody("self");

    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({ shouldCheckAuth: true, schema: accountReadSchema }),
    );

    expect(isLoading).toBeFalsy();
    const { validationSuccess, response } = await run(route, body);
    expect(isLoading).toBeFalsy();
    expect(validationSuccess).toBeTruthy();
    expect(response).toEqual(serverResponse.account.read.body);
  });
});
