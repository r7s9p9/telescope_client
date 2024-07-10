import { IconLanguage } from "@tabler/icons-react";
import { Text } from "../../../../shared/ui/Text/Text";
import { SegmentedButton } from "../../../../shared/ui/SegmentedButton/SegmentedButton";
import { Popup } from "../../../../shared/ui/Popup/Popup";
import { useLanguage } from "./useLanguage";

export function Language() {
  const { currentLang, handleSelect, onClose, contentRef, overlayRef, lang } =
    useLanguage();

  return (
    <Popup
      titleText={lang.language.TITLE}
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
    >
      <IconLanguage
        className="text-slate-400 self-center m-auto"
        strokeWidth="1"
        size={128}
      />
      <SegmentedButton
        size="md"
        type="horizontal"
        defaultValue={currentLang}
        onSelected={(value) => handleSelect(value as "en")}
        elements={[
          {
            label: (
              <Text size="md" font="light">
                {lang.language.OPTION_EN}
              </Text>
            ),
            value: "en",
          },
          {
            label: (
              <Text size="md" font="light">
                {lang.language.OPTION_RU}
              </Text>
            ),
            value: "ru",
          },
        ]}
      />
    </Popup>
  );
}
