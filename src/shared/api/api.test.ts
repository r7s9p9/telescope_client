import { describe, expect, test } from "vitest";
import { fetcher, useQuery } from "./api";
import { serverRoute } from "./api.constants";
import { accountReadSchema } from "./api.schema";
import { customRenderHook } from "../../../test/render";
import { serverResponse } from "../../../test/mocks/constants";

describe("fetcher", () => {
  test("Receiving data", async () => {
    const { success, auth, ban, payload, error } = await fetcher(
      serverRoute.account.read,
      {},
    );
    expect(success).toBeTruthy();
    expect(auth).toBeTruthy();
    expect(ban).toBeFalsy();
    expect(error).toBeUndefined();
    expect(payload).toEqual(serverResponse.account.read.body);
  });

  test("Not authorized", async () => {
    const { success, auth, ban } = await fetcher(serverRoute.test[401], {});

    expect(success).toBeTruthy();
    expect(auth).toBeFalsy();
    expect(ban).toBeFalsy();
  });

  test("Banned", async () => {
    const { success, auth, ban } = await fetcher(serverRoute.test[403], {});

    expect(success).toBeTruthy();
    expect(auth).toBeFalsy();
    expect(ban).toBeTruthy();
  });

  test("Status 404", async () => {
    const { success, payload, error } = await fetcher(
      serverRoute.test[404],
      {},
    );

    expect(success).toBeFalsy();
    expect(error).toBeDefined();
    expect(payload).toBeUndefined();
  });

  test("Status 500", async () => {
    const { success, payload, error } = await fetcher(
      serverRoute.test[500],
      {},
    );

    expect(success).toBeFalsy();
    expect(error).toBeDefined();
    expect(payload).toBeUndefined();
  });

  test("Server response body is null", async () => {
    const { success, payload, error } = await fetcher(
      serverRoute.test.null,
      {},
    );

    expect(success).toBeFalsy();
    expect(error).toBeDefined();
    expect(payload).toBeUndefined();
  });
});

describe("useQuery", () => {
  test("Receiving data", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));

    expect(isLoading).toBeFalsy();
    const { success, response } = await run(serverRoute.account.read, {});
    expect(isLoading).toBeFalsy();
    expect(success).toBeTruthy();
    expect(response).toEqual(serverResponse.account.read.body);
  });

  test("Not authorized", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));

    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[401], {});

    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Banned", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));

    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[403], {});

    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Status 404", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[404], {});
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Status 500", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[500], {});
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Response validation - empty json", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test.empty, {});
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Response validation - null body", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() => useQuery({ schema: accountReadSchema }));
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test.null, {});
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });
});
