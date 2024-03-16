// export function readStorage(read: ReadStorage) {

//   const result = Object.create(null);
//   if (read.type === "user") {
//     result.data = localStorage.getItem(userKey(read.id));
//     result.updateDate = localStorage.getItem(userUpdateDateKey(read.id));
//   }
//   if (read.type === "room") {
//     result.data = localStorage.getItem(roomKey(read.id));
//     result.updateDate = localStorage.getItem(roomUpdateDateKey(read.id));
//   }
//   if (result.data && result.updateDate) {
//     localStorage.setItem()
//   }
// }

// type UserId = `${string}-${string}-${string}-${string}-${string}`;
// type RoomId = `${string}-${string}-${string}-${string}-${string}`;

// const userKey = (userId: UserId) => `userId:${userId}` as const
// const roomKey = (roomId: RoomId) => `roomId:${roomId}` as const

// const userUpdateDateKey = (userId: UserId) => `${userKey(userId)}:updateDate`
// const userAccessDateKey = (userId: UserId) => `${userKey(userId)}:accessDate`

// const roomUpdateDateKey = (roomId: RoomId) => `${roomKey(roomId)}:updateDate`
// const roomAccessDateKey = (roomId: RoomId) => `${roomKey(roomId)}:accessDate`

// type WriteStorage = {
//   type: "roomId" | "userId";
//   id: UserId | RoomId
//   data: object;
//   accessDate: Date;
// };

// type ReadStorage = {
//   type: "room" | "user";
//   id: UserId | RoomId
//   data: object;
//   updateDate: Date;
// };

// export type MyAccountFields = {
//   general?: Omit<AccountFields["general"], "lastSeen">;
// };

// export type AccountFields = {
//   general?: {
//     username?: string | null;
//     name?: string | null;
//     bio?: string | null;
//     lastSeen?: string | null;
//   };
//   properties?: {
//     isBlockedYou?: boolean;
//     isFriend?: boolean;
//     isCanAddToRoom?: boolean;
//   };
// };
