import { IconCircleArrowLeft, IconFileUpload } from "@tabler/icons-react";
import { Button } from "../../../../shared/ui/Button/Button";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../shared/ui/Text/Text";
import { usePrivacy } from "./usePrivacy.ts";
import { ReactNode } from "react";
import { Select } from "../../../../shared/ui/Select/Select.tsx";

export function Privacy() {
  const {
    data,
    setData,
    isLoaded,
    handleUpdate,
    isFromAnotherPage,
    returnBack,
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
            Privacy settings
          </Text>
        </div>
        <Text size="md" font="light" className="select-none">
          Who can...
        </Text>
        <Item label="See my name" type="name" data={data} setData={setData} />
        <Item label="See my bio" type="bio" data={data} setData={setData} />
        <Item
          label="See when I was online"
          type="lastSeen"
          data={data}
          setData={setData}
        />
        <Item
          label="See my profile photos"
          type="seeProfilePhotos"
          data={data}
          setData={setData}
        />
        <Item
          label="See my friends"
          type="seeFriends"
          data={data}
          setData={setData}
        />
        {/* <Item
          label="canBeFriend"
          type="canBeFriend"
          data={data}
          setData={setData}
        /> */}
        <Item
          label="Invite me to the room"
          type="inviteToRoom"
          data={data}
          setData={setData}
        />
        <div className="flex flex-row-reverse justify-between items-end">
          <Button
            title="Update profile"
            size="md"
            onClick={handleUpdate}
            className="w-36 self-end justify-center"
          >
            <>
              <IconFileUpload {...iconProps} />
              <Text size="md" font="light">
                Update
              </Text>
            </>
          </Button>
          {isFromAnotherPage && (
            <Button
              title="Go back"
              size="md"
              onClick={returnBack}
              disabled={!isFromAnotherPage}
              className="w-36 justify-center"
            >
              <>
                <IconCircleArrowLeft {...iconProps} />
                <Text size="md" font="light">
                  Go back
                </Text>
              </>
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
      <div className="w-full md:w-[500px] h-full md:h-fit">{children}</div>
    </div>
  );
}

function Loader() {
  return (
    <Wrapper>
      <div className="w-full h-full p-4 md:rounded-xl animate-pulse bg-slate-50" />
    </Wrapper>
  );
}

function Item({
  label,
  data,
  setData,
  type,
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
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
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
        <option value="everybody">Everybody</option>
        <option value="friendOfFriends">Friends of friends</option>
        <option value="friends">Friends</option>
        <option value="nobody">Nobody</option>
      </Select>
    </div>
  );
}
