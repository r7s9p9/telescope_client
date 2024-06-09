import { z } from "zod";
import { privacyRule } from "./api.constants";
import { RoomId, UserId } from "../../types";
import { env } from "../lib/env";

const userIdSchema = z
  .string()
  .uuid()
  .transform((id) => {
    return id as UserId;
  });

export const roomIdSchema = z
  .string()
  .uuid()
  .transform((id) => {
    return id as RoomId;
  });

const selfIdSchema = z.literal("self");
const serviceIdSchema = z.literal("service");

export const devSchema = z
  .object({
    message: z.array(z.string()).optional(),
    error: z.array(z.object({}).or(z.string())).optional(),
  })
  .optional();

export const emailSchema = z.string().email().max(env.emailLengthMax);
export const usernameSchema = z
  .string()
  .min(env.usernameRange.min)
  .max(env.usernameRange.max);
export const passwordSchema = z
  .string()
  .min(env.passwordRange.min)
  .max(env.passwordRange.max);
export const codeSchema = z.string().length(env.codeLength);

export const nameSchema = z.string().max(env.nameLengthMax);
export const bioSchema = z.string().max(env.bioLengthMax);
export const lastSeenSchema = z.string();

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const codeFormSchema = z.object({
  code: codeSchema,
});

export const registerFormSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export const authLoginSchema = z.object({
  success: z.boolean(),
  code: z.boolean().optional(),
});
export type AuthLoginType = z.infer<typeof authLoginSchema>;

export const authCodeSchema = z.object({
  success: z.boolean(),
});
export type AuthCodeType = z.infer<typeof authCodeSchema>;

export const authRegisterSchema = z.object({
  success: z.boolean(),
  errorCode: z
    .union([
      z.literal("EMAIL_ALREADY_EXISTS"),
      z.literal("USERNAME_ALREADY_EXISTS"),
    ])
    .optional(),
});
export type AuthRegisterType = z.infer<typeof authRegisterSchema>;

const accessSchema = z.boolean();
const successSchema = z.boolean();
const allCountSchema = z.number();

const privacyRuleSchema = z.union([
  z.literal(privacyRule.everybody),
  z.literal(privacyRule.friends),
  z.literal(privacyRule.friendOfFriends),
  z.literal(privacyRule.nobody),
]);

const privacyRuleLimitedSchema = z.union([
  z.literal(privacyRule.everybody),
  z.literal(privacyRule.friendOfFriends),
  z.literal(privacyRule.nobody),
]);

export const accountReadSchema = z.object({
  targetUserId: z.union([selfIdSchema, userIdSchema]),
  general: z
    .object({
      username: usernameSchema,
      name: nameSchema.optional(),
      bio: bioSchema.optional(),
      lastSeen: lastSeenSchema.optional(),
    })
    .optional(),
  privacy: z
    .object({
      name: privacyRuleSchema.optional(),
      bio: privacyRuleSchema.optional(),
      lastSeen: privacyRuleSchema.optional(),

      seeProfilePhotos: privacyRuleSchema.optional(),
      seeFriends: privacyRuleSchema.optional(),
      canBeFriend: privacyRuleLimitedSchema.optional(),
      inviteToRoom: privacyRuleSchema.optional(),
    })
    .optional(),
});

export type AccountReadType = z.infer<typeof accountReadSchema>;

export const logoutSchema = z.object({
  success: z.boolean(),
});
export type LogoutType = z.infer<typeof logoutSchema>;

const messageContent = z.object({ text: z.string().min(1) });
const messageAuthorId = z.union([userIdSchema, selfIdSchema, serviceIdSchema]);
const messageReplyTo = userIdSchema.optional();
const messageTargetId = userIdSchema.optional(); // For Service Message

const maxMessageTimestamp = 2000000000000 as const; // TODO move to .env
const minMessageTimestamp = 1000000000000 as const; // TODO move to .env

const messageTimestamp = z
  .number()
  .finite()
  .safe()
  .gte(minMessageTimestamp)
  .lte(maxMessageTimestamp);
const messageCreated = messageTimestamp;
const messageModified = messageTimestamp;

export const messageSchema = z.object({
  username: z.string().optional(),
  authorId: messageAuthorId,
  content: messageContent,
  created: messageCreated,
  modified: messageModified.optional(),
  targetId: messageTargetId.optional(),
  replyTo: messageReplyTo.optional(),
});

export const messageDatesSchema = z.object({
  created: messageCreated,
  modified: messageModified.optional(),
});

export type MessageType = z.infer<typeof messageSchema>;
export type MessageDates = z.infer<typeof messageDatesSchema>;

export const roomNameSchema = z.string().min(4).max(32);
const roomTypeSchema = z.union([
  z.literal("public"),
  z.literal("private"),
  z.literal("service"),
  z.literal("single"),
]);
export const roomAboutSchema = z.string().max(80);
const roomCreatedSchema = z.number();

export const roomUpdateInfoSchema = z.object({
  name: roomNameSchema.optional(),
  type: z
    .union([z.literal("public"), z.literal("private"), z.literal("single")])
    .optional(),
  about: roomAboutSchema.optional(),
  creatorId: userIdSchema.optional(),
});

export type RoomInfoUpdate = z.infer<typeof roomUpdateInfoSchema>;

export const roomInfoSchema = z.object({
  success: successSchema,
  roomId: roomIdSchema,
  info: z.object({
    name: roomNameSchema,
    type: roomTypeSchema,
    about: roomAboutSchema,
    created: roomCreatedSchema,
    creatorId: z.union([userIdSchema, selfIdSchema, serviceIdSchema]),
    userCount: z.number(),
    isMember: z.boolean(),
  }),
});

export type RoomInfoType = z.infer<typeof roomInfoSchema>;

const roomSchema = z.object({
  roomId: roomIdSchema,
  name: roomNameSchema,
  type: roomTypeSchema,
  about: roomAboutSchema.optional(),
  created: roomCreatedSchema,
  creatorId: z.union([userIdSchema, selfIdSchema, serviceIdSchema]),
  unreadCount: z.number(),
  userCount: z.number(),
  isMember: z.boolean(),
  lastMessage: messageSchema.optional(),
});

export const roomsSchema = z.object({
  success: z.boolean(),
  allCount: z.number(),
  items: z.array(roomSchema).optional(),
});

export type RoomType = z.infer<typeof roomSchema>;
export type RoomsType = z.infer<typeof roomsSchema>;

export const messageReadSchema = z.object({
  access: accessSchema,
  success: successSchema,
  roomId: roomIdSchema,
  allCount: allCountSchema,
  messages: z.array(messageSchema).optional(),
});

export type MessageReadType = z.infer<typeof messageReadSchema>;

export const messageCompareSchema = z.object({
  access: accessSchema,
  success: successSchema,
  roomId: roomIdSchema,
  isEqual: z.boolean(),
  toRemove: z.array(messageCreated).optional(),
  toUpdate: z.array(messageSchema).optional(),
  dev: devSchema,
});
export type MessageCompareType = z.infer<typeof messageCompareSchema>;

export const sendMessageFormSchema = z.object({
  text: z.string().trim().optional(),
});

export type SendMessageFormType = z.infer<typeof sendMessageFormSchema>;

export const messageSendSchema = z
  .object({
    access: z.literal(false),
    success: z.literal(false),
  })
  .or(
    z.object({
      access: z.literal(true),
      success: z.literal(true),
      created: messageCreated,
    }),
  );
export type MessageSendType = z.infer<typeof messageSendSchema>;

export const messageUpdateSchema = z
  .object({
    access: z.literal(false),
    success: z.literal(false),
  })
  .or(
    z.object({
      access: z.literal(true),
      success: z.literal(true),
      dates: z.object({ created: messageCreated, modified: messageModified }),
    }),
  );

export type MessageUpdateType = z.infer<typeof messageUpdateSchema>;

export const messageDeleteSchema = z.object({
  access: z.boolean(),
  success: z.boolean(),
});

export type MessageDeleteType = z.infer<typeof messageDeleteSchema>;

export const createRoomFormSchema = z.object({
  name: roomNameSchema.min(4),
  about: roomAboutSchema,
});

export const roomCreateSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema.optional(),
});
export type RoomCreateType = z.infer<typeof roomCreateSchema>;

export const roomUpdateSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema.optional(),
});
export type RoomUpdateType = z.infer<typeof roomUpdateSchema>;

export const roomDeleteSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema,
});
export type RoomDeleteType = z.infer<typeof roomDeleteSchema>;

export const roomLeaveSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema,
});
export type RoomLeaveType = z.infer<typeof roomLeaveSchema>;

export const roomJoinSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  roomId: roomIdSchema,
});
export type RoomJoinType = z.infer<typeof roomJoinSchema>;

export const roomGetMembersSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  isEmpty: z.boolean(),
  roomId: roomIdSchema,
  users: accountReadSchema.array().optional(),
});

export type RoomGetMembersType = z.infer<typeof roomGetMembersSchema>;

export const roomBlockedUsersSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  isEmpty: z.boolean(),
  roomId: roomIdSchema,
  users: accountReadSchema.array().optional(),
});

export type RoomBlockedUsersType = z.infer<typeof roomBlockedUsersSchema>;

export const searchRoomsSchema = z
  .object({
    success: z.boolean(),
    isEmpty: z.literal(false),
    rooms: z.array(
      z.object({
        name: roomNameSchema,
        userCount: z.number().finite(),
        roomId: roomIdSchema,
      }),
    ),
  })
  .or(
    z.object({
      success: z.boolean(),
      isEmpty: z.literal(true),
    }),
  );

export type SearchRoomsType = z.infer<typeof searchRoomsSchema>;

export const roomKickMemberSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});

export type RoomKickMemberType = z.infer<typeof roomKickMemberSchema>;

export const roomBanMemberSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});

export type RoomBanMemberType = z.infer<typeof roomBanMemberSchema>;

export const roomUnbanUserSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});

export type RoomUnbanUserType = z.infer<typeof roomUnbanUserSchema>;

export const roomSearchUsersToInviteSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  isEmpty: z.boolean().optional(),
  users: accountReadSchema.array().optional(),
});

export type RoomSearchUsersToInviteType = z.infer<
  typeof roomSearchUsersToInviteSchema
>;

export const roomInviteUserSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});

export type RoomInviteUserType = z.infer<typeof roomInviteUserSchema>;
