import { Paper } from "../Paper/Paper";
import { Text } from "../Text/Text";
import { Button } from "../Button/Button";
import { IconCheck, IconX } from "@tabler/icons-react";

export function ConfirmPopup({
  onAgree,
  onClose,
  text,
}: {
  onAgree: () => void;
  onClose: () => void;
  text: string;
}) {
  return (
    <Paper
      padding={4}
      rounded="lg"
      shadow="md"
      className="flex flex-col justify-center items-center"
    >
      <Text
        size="md"
        font="light"
        className="mt-2 mb-4 max-w-72 text-center select-none"
      >
        {text}
      </Text>
      <div className="w-full flex justify-between items-between gap-8">
        <Button
          size="md"
          title="yes"
          onClick={() => {
            onAgree();
            onClose();
          }}
          className="items-center"
        >
          <IconCheck className="text-green-600" />
          <Text size="md" font="light">
            Agree
          </Text>
        </Button>
        <Button
          size="md"
          title="yes"
          onClick={() => {
            onClose();
          }}
        >
          <IconX className="text-red-600" />
          <Text size="md" font="light">
            Cancel
          </Text>
        </Button>
      </div>
    </Paper>
  );
}
