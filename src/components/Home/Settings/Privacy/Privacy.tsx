import { IconCircleArrowLeft, IconFileUpload } from "@tabler/icons-react";
import { Button } from "../../../../shared/ui/Button/Button";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../shared/ui/Text/Text";
import { usePrivacy } from "./usePrivacy.ts";
import { ReactNode } from "react";
import { Select } from "../../../../shared/ui/Select/Select.tsx";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider.tsx";

export function Privacy() {
  const {
    data,
    setData,
    isLoaded,
    handleUpdate,
    isFromAnotherPage,
    returnBack,
    lang,
  } = usePrivacy();

  if (!isLoaded) {
    return <Loader />;
  }

  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 24,
  };

  return (
    <Wrapper>
      <Paper
        padding={4}
        className="w-full h-full flex flex-col md:shadow-md md:rounded-xl bg-slate-50"
      >
        <div className="flex justify-between items-center">
          <Text size="xl" font="light" className="select-none text-center">
            {lang.privacy.TITLE_HEAD}
          </Text>
        </div>
        <Text size="md" font="light" className="select-none">
          {lang.privacy.TITLE_TAIL}
        </Text>
        <Item
          label={lang.privacy.ITEM_NAME}
          type="name"
          data={data}
          setData={setData}
          lang={lang}
        />
        <Item
          label={lang.privacy.ITEM_BIO}
          type="bio"
          data={data}
          setData={setData}
          lang={lang}
        />
        <Item
          label={lang.privacy.ITEM_LAST_SEEN}
          type="lastSeen"
          data={data}
          setData={setData}
          lang={lang}
        />
        <Item
          label={lang.privacy.ITEM_PROFILE_PHOTOS}
          type="seeProfilePhotos"
          data={data}
          setData={setData}
          lang={lang}
        />
        <Item
          label={lang.privacy.ITEM_FRIENDS}
          type="seeFriends"
          data={data}
          setData={setData}
          lang={lang}
        />
        {/* <Item
          label={lang.privacy.ITEM_CAN_BE_FRIEND}
          type="canBeFriend"
          data={data}
          setData={setData}
          lang={lang}
        /> */}
        <Item
          label={lang.privacy.ITEM_INVITE}
          type="inviteToRoom"
          data={data}
          setData={setData}
          lang={lang}
        />
        <div className="flex grow flex-row-reverse justify-between items-end">
          <Button
            title={lang.privacy.BUTTON_UPDATE_LABEL}
            size="md"
            onClick={handleUpdate}
            className="w-36 self-end justify-center"
          >
            <IconFileUpload {...iconProps} />
            <Text size="md" font="light">
              {lang.privacy.BUTTON_UPDATE_LABEL}
            </Text>
          </Button>
          {isFromAnotherPage && (
            <Button
              title={lang.privacy.BUTTON_GO_BACK_LABEL}
              size="md"
              onClick={returnBack}
              disabled={!isFromAnotherPage}
              className="w-36 justify-center"
            >
              <IconCircleArrowLeft {...iconProps} />
              <Text size="md" font="light">
                {lang.privacy.BUTTON_GO_BACK_LABEL}
              </Text>
            </Button>
          )}
        </div>
      </Paper>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center border-t-2 border-slate-100 md:border-0">
      <div className="w-full h-full md:h-[520px] md:w-[500px]">{children}</div>
    </div>
  );
}

function Loader() {
  return (
    <Wrapper>
      <div className="w-full h-full p-4 flex flex-col md:shadow-md md:rounded-xl bg-slate-50">
        <div className="w-48 h-8 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-24 h-6 mb-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-14 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-14 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-14 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-14 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-14 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-14 mb-2 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </Wrapper>
  );
}

function Item({
  label,
  data,
  setData,
  type,
  lang,
}: {
  label: string;
  data: ReturnType<typeof usePrivacy>["data"];
  setData: ReturnType<typeof usePrivacy>["setData"];
  type:
    | "name"
    | "bio"
    | "lastSeen"
    | "seeProfilePhotos"
    | "seeFriends"
    | "canBeFriend"
    | "inviteToRoom";
  lang: ReturnType<typeof useLang>["lang"];
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Text size="md" font="light">
        {label}
      </Text>
      <Select
        value={data?.[type] || ""}
        setValue={(value) =>
          setData((prevData) => ({ ...prevData, [type]: value }))
        }
        size="md"
        className="bg-slate-100 text-center"
      >
        <option value="everybody">{lang.privacy.ITEM_OPTION_EVERYBODY}</option>
        <option value="friendOfFriends">
          {lang.privacy.ITEM_OPTION_FRIENDS_OF_FRIENDS}
        </option>
        <option value="friends">{lang.privacy.ITEM_OPTION_FRIENDS}</option>
        <option value="nobody">{lang.privacy.ITEM_OPTION_NOBODY}</option>
      </Select>
    </div>
  );
}
