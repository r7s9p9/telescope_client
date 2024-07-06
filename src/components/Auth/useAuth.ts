import { useLocation, useNavigate } from "react-router-dom";
import {
  useQueryCode,
  useQueryLogin,
  useQueryRegister,
} from "../../shared/api/api.model";
import { useNotify } from "../../shared/features/Notification/Notification";
import { Dispatch, useEffect, useState } from "react";
import { langAuthNotification, langError } from "../../locales/en";
import { routes } from "../../constants";

interface ShowItemState {
  showItem: "login" | "register" | "code";
  setShowItem: Dispatch<ShowItemState["showItem"]>;
}

export function useMain({ type }: { type: "login" | "register" }) {
  const [showItem, setShowItem] = useState<ShowItemState["showItem"]>(type);
  const [email, setEmail] = useState("");

  const notify = useNotify();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.loggedOut) {
      notify.show.info(langAuthNotification.LOGGED_OUT);
      // remove state from location
      navigate({ pathname: location.pathname });
    }
    if (location.state?.sessionBlocked) {
      notify.show.info(langAuthNotification.SESSION_BLOCKED);
      // remove state from location
      navigate({ pathname: location.pathname });
    }
  }, [location, navigate, notify.show]);

  // */code route protection
  useEffect(() => {
    if (location.pathname === routes.code.path && showItem !== "code") {
      navigate({ pathname: routes.login.path });
    }
  }, [location, navigate, showItem]);

  function handleCodeRequired(email: string) {
    setShowItem("code");
    navigate({ pathname: routes.code.path });
    setEmail(email);
  }

  const switchForm = {
    toLogin: () => {
      setEmail("");
      setShowItem("login");
      navigate({ pathname: routes.login.path });
    },
    toRegister: () => {
      setEmail("");
      setShowItem("register");
      navigate({ pathname: routes.register.path });
    },
  };

  return { showItem, switchForm, handleCodeRequired, email };
}

export function useLogin({
  handleCodeRequired,
}: {
  handleCodeRequired: ReturnType<typeof Function>;
}) {
  const query = useQueryLogin();
  const navigate = useNavigate();
  const notify = useNotify();

  const defaultForm = {
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  };

  const [form, setForm] = useState(defaultForm);
  const setEmail = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, email: { value, error: "" } }));
  };
  const setPassword = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, password: { value, error: "" } }));
  };

  const reset = () => {
    setForm(defaultForm);
  };

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      email: form.email.value,
      password: form.password.value,
    });

    if (!success && requestError) {
      setForm((prevForm) => ({
        ...prevForm,
        email: {
          ...prevForm.email,
          error: requestError.email || "",
        },
        password: {
          ...prevForm.password,
          error: requestError.password || "",
        },
      }));
      return;
    }

    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (response?.success) {
      if (response.code) {
        handleCodeRequired(form.email.value);
      } else {
        navigate({ pathname: routes.home.path });
      }
    } else {
      notify.show.error(langAuthNotification.INCORRECT_CREDENTIALS);
    }
  };

  return {
    form,
    setEmail,
    setPassword,
    run,
    reset,
    isLoading: query.isLoading,
  };
}

export function useCode({ email }: { email: string }) {
  const query = useQueryCode();
  const navigate = useNavigate();
  const notify = useNotify();

  const defaultForm = {
    value: "",
    error: "",
  };

  const [code, setCode] = useState(defaultForm);

  const reset = () => {
    setCode(defaultForm);
  };

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      code: code.value,
      email,
    });

    if (!success && requestError) {
      setCode((prevCode) => ({
        ...prevCode,
        error: requestError.code || "",
      }));
      if (requestError.email) {
        notify.show.error(langAuthNotification.OUTDATED_EMAIL);
        navigate({ pathname: routes.login.path });
        return;
      }
    }

    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (!response.success) notify.show.error(langAuthNotification.BAD_CODE);
    if (response.success) navigate({ pathname: routes.home.path });
  };

  return {
    code,
    setCode: (value: string) => {
      setCode((prevCode) => ({ ...prevCode, value }));
    },
    run,
    reset,
    isLoading: query.isLoading,
  };
}

export function useRegister({
  switchForm,
}: {
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
}) {
  const query = useQueryRegister();
  const navigate = useNavigate();
  const notify = useNotify();

  const defaultForm = {
    email: { value: "", error: "" },
    username: { value: "", error: "" },
    password: { value: "", error: "" },
  };

  const [form, setForm] = useState(defaultForm);
  const setEmail = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, email: { value, error: "" } }));
  };
  const setUsername = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, username: { value, error: "" } }));
  };
  const setPassword = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, password: { value, error: "" } }));
  };

  const reset = () => {
    setForm(defaultForm);
  };

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      email: form.email.value,
      password: form.password.value,
      username: form.username.value,
    });

    if (!success && requestError) {
      setForm((prevForm) => ({
        ...prevForm,
        email: {
          ...prevForm.email,
          error: requestError.email || "",
        },
        username: {
          ...prevForm.username,
          error: requestError.username || "",
        },
        password: {
          ...prevForm.password,
          error: requestError.password || "",
        },
      }));
      return;
    }

    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (!response.success) {
      switch (response.errorCode) {
        case "EMAIL_ALREADY_EXISTS":
          notify.show.error(langAuthNotification.EMAIL_EXISTS);
          break;
        case "USERNAME_ALREADY_EXISTS":
          notify.show.error(langAuthNotification.USERNAME_EXISTS);
          break;
        default:
          notify.show.error(langError.RESPONSE_COMMON_MESSAGE);
          break;
      }
    } else {
      notify.show.info(langAuthNotification.REGISTER_SUCCESS);
      reset();
      navigate({ pathname: routes.login.path });
      switchForm.toLogin();
    }
  };

  return {
    form,
    setEmail,
    setUsername,
    setPassword,
    run,
    reset,
    isLoading: query.isLoading,
  };
}
