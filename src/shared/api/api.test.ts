import { describe, expect, test } from "vitest";
import { fetcher, useQuery } from "./api";
import { serverRoute } from "./api.constants";
import {
  readAccountRequestSchema,
  readAccountResponseSchema,
} from "./api.schema";
import { customRenderHook } from "../../../test/render";
import { serverResponse } from "../../../test/mocks/constants";

const requestPayload = {
  userId: "self",
  toRead: { general: ["username", "name", "bio"] },
};

describe("fetcher", () => {
  test("Receiving data", async () => {
    const { success, loggedOut, sessionBlocked, payload, error } =
      await fetcher(serverRoute.account.read, requestPayload);

    expect(success).toBeTruthy();
    expect(loggedOut).toBeFalsy();
    expect(sessionBlocked).toBeFalsy();
    expect(error).toBeUndefined();
    expect(payload).toEqual(serverResponse.account.read.body);
  });

  test("Not authorized", async () => {
    const { success, loggedOut, sessionBlocked } = await fetcher(
      serverRoute.test[401],
      requestPayload,
    );

    expect(success).toBeTruthy();
    expect(loggedOut).toBeTruthy();
    expect(sessionBlocked).toBeFalsy();
  });

  test("Banned", async () => {
    const { success, loggedOut, sessionBlocked } = await fetcher(
      serverRoute.test[403],
      requestPayload,
    );

    expect(success).toBeTruthy();
    expect(loggedOut).toBeFalsy();
    expect(sessionBlocked).toBeTruthy();
  });

  test("Status 404", async () => {
    const { success, payload, error } = await fetcher(
      serverRoute.test[404],
      requestPayload,
    );

    expect(success).toBeFalsy();
    expect(error).toBeDefined();
    expect(payload).toBeUndefined();
  });

  test("Status 500", async () => {
    const { success, payload, error } = await fetcher(
      serverRoute.test[500],
      requestPayload,
    );

    expect(success).toBeFalsy();
    expect(error).toBeDefined();
    expect(payload).toBeUndefined();
  });

  test("Server response body is null", async () => {
    const { success, payload, error } = await fetcher(
      serverRoute.test.null,
      requestPayload,
    );

    expect(success).toBeFalsy();
    expect(error).toBeDefined();
    expect(payload).toBeUndefined();
  });
});

describe("useQuery", () => {
  // Using useQuery bypassing api.model.ts is a very bad idea.
  // This approach is ONLY suitable for testing useQuery.

  test("Receiving data", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        responseSchema: readAccountResponseSchema,
        requestSchema: readAccountRequestSchema,
      }),
    );

    expect(isLoading).toBeFalsy();
    const { success, response, requestError, responseError } = await run(
      serverRoute.account.read,
      requestPayload,
    );
    expect(isLoading).toBeFalsy();
    expect(success).toBeTruthy();
    expect(requestError).toBeUndefined();
    expect(responseError).toBeUndefined();
    expect(response).toEqual(serverResponse.account.read.body);
  });

  test("Not authorized", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        requestSchema: readAccountRequestSchema,
        responseSchema: readAccountResponseSchema,
      }),
    );

    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[401], requestPayload);

    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Session blocked", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        requestSchema: readAccountRequestSchema,
        responseSchema: readAccountResponseSchema,
      }),
    );

    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[403], requestPayload);

    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Status 404", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        requestSchema: readAccountRequestSchema,
        responseSchema: readAccountResponseSchema,
      }),
    );

    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[404], requestPayload);
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Status 500", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        requestSchema: readAccountRequestSchema,
        responseSchema: readAccountResponseSchema,
      }),
    );
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test[500], requestPayload);
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Response validation - empty json", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        requestSchema: readAccountRequestSchema,
        responseSchema: readAccountResponseSchema,
      }),
    );
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test.empty, requestPayload);
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });

  test("Response validation - null body", async () => {
    const {
      result: {
        current: { isLoading, run },
      },
    } = customRenderHook(() =>
      useQuery({
        requestSchema: readAccountRequestSchema,
        responseSchema: readAccountResponseSchema,
      }),
    );
    expect(isLoading).toBeFalsy();
    const { success } = await run(serverRoute.test.null, requestPayload);
    expect(isLoading).toBeFalsy();
    expect(success).toBeFalsy();
  });
});
