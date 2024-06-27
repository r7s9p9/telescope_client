import { Text } from "../Text/Text";
import { Button } from "../Button/Button";

export function ConfirmPopupContent({
  onAgree,
  onClose,
  text,
}: {
  onAgree: () => void;
  onClose: () => void;
  text: {
    question: string;
    confirm: string;
    cancel: string;
  };
}) {
  return (
    <>
      <Text
        size={"xl"}
        font="light"
        className="m-auto text-center overflow-y-auto"
      >
        {text.question}
      </Text>
      <div className="w-full border-t-2 border-slate-100" />
      <div className="mt-4 w-full flex flex-col md:flex-row justify-center items-between gap-4">
        <Button
          size="md"
          title="Confirm"
          onClick={() => {
            onAgree();
            onClose();
          }}
          unstyled
          className="w-full items-center justify-center ring-2 ring-slate-200 rounded-lg hover:bg-slate-200"
        >
          <Text
            size="md"
            font="light"
            uppercase
            letterSpacing
            className="text-red-600"
          >
            {text.confirm}
          </Text>
        </Button>
        <Button
          size="md"
          title="Cancel"
          onClick={() => {
            onClose();
          }}
          unstyled
          className="w-full items-center justify-center ring-2 ring-slate-200 rounded-lg hover:bg-slate-200"
        >
          <Text size="md" font="light" uppercase letterSpacing>
            {text.cancel}
          </Text>
        </Button>
      </div>
    </>
  );
}
