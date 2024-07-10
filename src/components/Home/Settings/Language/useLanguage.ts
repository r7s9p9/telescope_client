import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../../constants";
import { useOnClickOutside } from "../../../../shared/hooks/useOnClickOutside";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

export function useLanguage() {
  const { lang, currentLang, switchTo } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const onClose = () => {
    if (!location.state?.prevPath) {
      navigate(routes.home.path);
      return;
    }
    navigate(location.state?.prevPath);
  };

  const { contentRef, overlayRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  return {
    currentLang,
    handleSelect: switchTo,
    onClose,
    contentRef,
    overlayRef,
    lang,
  };
}
