import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { z } from "zod";
// import { useStore } from "../store/store";
// import { StoreType } from "../store/types";

function validatorFactory(data: object, schema: z.ZodTypeAny) {
  const result = schema.safeParse(data);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

// export function useWatchdog() {
//   const stateAction = useStore().routesState();

//   const isActive = (route: keyof StoreType["routesState"]) => {
//     return stateAction.read(route)
//   }

//   const incBadCount = () => {}
//   const resetBadCounter = () => {}
// }

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
      return { success: false as const, error: `status ${result.status}` };
    }
    return {
      success: true as const,
      auth: result.status !== 401 && result.status !== 403,
      ban: result.status === 403,
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
  responseSchema?: z.ZodTypeAny;
  requestSchema?: z.ZodTypeAny;
  disableRequestValidationLogging?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const run = async (route: string, body: object) => {
    setIsLoading(true);

    if (requestSchema) {
      const { success, error } = validatorFactory(body, requestSchema);
      if (!success) {
        if (!disableRequestValidationLogging) {
          console.error(
            `Request validation error on route ${route}`,
            "\nRequest:",
            body,
            "\nError:",
            error,
          );
        }
        setIsLoading(false);
        return { success: false as const, requestError: error };
      }
    }

    const response = await fetcher(route, body);
    if (!response.success) {
      console.error(
        `Fetcher error on route ${route}`,
        "\nError:",
        response.error,
      );
      setIsLoading(false);
      return { success: false as const };
    }

    if (!response.auth) {
      // TODO: => state: Ban || Logged out
      console.error("Session logged out");
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
      setIsLoading(false);
      return { success: false as const };
    }

    if (!responseSchema) {
      return { success: true, response: response.payload };
    }

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
      setIsLoading(false);
      return { success: false as const, responseError: error };
    }

    setIsLoading(false);
    return { success: true as const, response: data };
  };
  return { isLoading, run };
}
