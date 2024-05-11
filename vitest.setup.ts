import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { setupServer } from "msw/node";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { handlers } from "./test/mocks/handlers";

// Workaround
expect.extend(matchers);

const server = setupServer(...handlers);

// Start server before all tests (msw)
beforeAll(() => {
  // The error is thrown whenever there is a request that does not have a corresponding request handler
  server.listen({ onUnhandledRequest: "error" });
});

// Close server after all tests (msw)
afterAll(() => server.close());

afterEach(() => {
  // Clearing the DOM after each test
  cleanup();
  // Reset handlers after each test (msw)
  server.resetHandlers();
});
