import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { z } from "zod";
import { useWatchdog } from "./watchdog/useWatchdog";
import { useLang } from "../features/LangProvider/LangProvider";

const FAILURE_THRESHOLD = 3;

function validatorFactory(data: object, schema: z.ZodTypeAny) {
  const result = schema.safeParse(data);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export const healthCheck = async (route: string) => {
  try {
    const result = await fetch(route + "/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200 || (await result.json())?.status === "OK") {
      return { success: true as const };
    }
    return { success: false as const };
  } catch (error) {
    return { success: false as const };
  }
};

export const fetcher = async (route: string, body: object) => {
  try {
    const result = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (result.status === 404 || result.status === 500) {
      return {
        success: false as const,
        error: `Status ${result.status}`,
      };
    }
    return {
      success: true as const,
      loggedOut: result.status === 401,
      sessionBlocked: result.status === 403,
      payload: await result.json(),
    };
  } catch (error) {
    return { success: false as const, error };
  }
};

export function useQuery({
  responseSchema,
  requestSchema,
  disableRequestValidationLogging,
}: {
  responseSchema: z.ZodTypeAny;
  requestSchema: z.ZodTypeAny;
  disableRequestValidationLogging?: boolean;
}) {
  const { lang } = useLang();
  const attemptCount = useRef(1);
  const [isLoading, setIsLoading] = useState(false);
  const watchdog = useWatchdog();
  const navigate = useNavigate();

  const run = async (route: string, body: object) => {
    attemptCount.current = 1;
    setIsLoading(true);

    // Checking if the route is disabled by watchdog
    const { disabled } = watchdog.getState(route);
    if (disabled) {
      return {
        success: false as const,
        responseError: lang.error.RESPONSE_COMMON_MESSAGE,
      };
    }

    // Checking the compliance of the request scheme
    const request = validatorFactory(body, requestSchema);
    if (!request.success) {
      // Disabling logging is intended to ignore logging of request scheme mismatches
      // in cases of UI forms and data entered directly by the user
      if (!disableRequestValidationLogging) {
        console.error(
          `Request validation error on route ${route}`,
          "\nRequest:",
          body,
          "\nError:",
          request.error,
        );
      }
      setIsLoading(false);
      return {
        success: false as const,
        requestError: disableRequestValidationLogging
          ? request.error
          : lang.error.REQUEST_COMMON_MESSAGE,
      };
    }

    // Sending a request
    let response: Awaited<ReturnType<typeof fetcher>> = Object.create(null);
    while (attemptCount.current < FAILURE_THRESHOLD) {
      response = await fetcher(route, request.data);
      if (!response.success) {
        attemptCount.current++;
        continue;
      }
      break;
    }

    //  Checking the success of the request
    if (!response.success) {
      console.error(
        `Fetcher error on route ${route}`,
        "\nError:",
        response.error,
      );
      watchdog.report(route);
      setIsLoading(false);
      return {
        success: false as const,
        responseError: lang.error.RESPONSE_COMMON_MESSAGE,
      };
    }

    // Checking the validity of the current session
    if (response.loggedOut || response.sessionBlocked) {
      navigate(
        { pathname: routes.login.path },
        {
          state: {
            sessionBlocked: response.sessionBlocked,
            loggedOut: response.loggedOut,
          },
        },
      );
    }

    if (response.loggedOut) {
      navigate({ pathname: routes.login.path }, { state: { loggedOut: true } });
      setIsLoading(false);
      return { success: false as const };
    }

    // Checking the compliance of the response scheme
    const { success, data, error } = validatorFactory(
      response.payload,
      responseSchema,
    );
    if (!success) {
      console.error(
        `Response validation error on route ${route}`,
        "\nResponse:",
        response.payload,
        "\nError:",
        error,
      );
      watchdog.report(route);
      setIsLoading(false);
      return {
        success: false as const,
        responseError: lang.error.RESPONSE_COMMON_MESSAGE,
      };
    }

    setIsLoading(false);
    return { success: true as const, response: data };
  };
  return { isLoading, run };
}
