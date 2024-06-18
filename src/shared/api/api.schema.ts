import { z } from "zod";
import { privacyRule } from "./api.constants";
import { env } from "../lib/env";
import { UUID } from "crypto";

const userIdSchema = z
  .string()
  .uuid()
  .transform((id) => {
    return id as UUID;
  });

export type UserId = z.infer<typeof userIdSchema>;

export const roomIdSchema = z
  .string()
  .uuid()
  .transform((id) => {
    return id as UUID;
  });

export type RoomId = z.infer<typeof userIdSchema>;

const selfIdSchema = z.literal("self");
const serviceIdSchema = z.literal("service");

export const emailSchema = z
  .string()
  .email()
  .max(
    env.emailLengthMax,
    `Email must not be greater than ${env.emailLengthMax} characters`,
  );

export const usernameSchema = z
  .string()
  .min(env.usernameRange.min)
  .max(env.usernameRange.max);
export const passwordSchema = z
  .string()
  .min(env.passwordRange.min)
  .max(env.passwordRange.max);
export const codeSchema = z.string().length(env.codeLength);

export const nameSchema = z.string().min(2).max(env.nameLengthMax);
export const bioSchema = z.string().max(env.bioLengthMax);
export const lastSeenSchema = z.string();

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

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginRequestType = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
  success: z.boolean(),
  code: z.boolean().optional(),
});
export type LoginResponseType = z.infer<typeof loginResponseSchema>;

export const codeRequestSchema = z.object({
  email: emailSchema,
  code: codeSchema,
});
export type CodeRequestType = z.infer<typeof codeRequestSchema>;

export const codeResponseSchema = z.object({
  success: z.boolean(),
});
export type CodeResponseType = z.infer<typeof codeResponseSchema>;

export const registerRequestSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export type RegisterRequestType = z.infer<typeof registerRequestSchema>;

export const registerResponseSchema = z.object({
  success: z.boolean(),
  errorCode: z
    .union([
      z.literal("EMAIL_ALREADY_EXISTS"),
      z.literal("USERNAME_ALREADY_EXISTS"),
    ])
    .optional(),
});
export type RegisterResponseType = z.infer<typeof registerResponseSchema>;

export const readAccountRequestSchema = z.object({
  userId: z.union([selfIdSchema, userIdSchema]),
  toRead: z.object({
    general: z
      .array(
        z
          .union([
            z.literal("name"),
            z.literal("username"),
            z.literal("bio"),
            z.literal("lastSeen"),
          ])
          .optional(),
      )
      .optional(),
    privacy: z
      .array(
        z
          .union([
            z.literal("name"),
            z.literal("bio"),
            z.literal("lastSeen"),
            z.literal("seeProfilePhotos"),
            z.literal("inviteToRoom"),
            z.literal("seeFriends"),
          ])
          .optional(),
      )
      .optional(),
  }),
});
export type ReadAccountRequestType = z.infer<typeof readAccountRequestSchema>;

export const readAccountResponseSchema = z.object({
  targetUserId: z.union([selfIdSchema, userIdSchema]),
  general: z
    .object({
      username: usernameSchema,
      name: nameSchema.min(2).optional(),
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
export type ReadAccountResponseType = z.infer<typeof readAccountResponseSchema>;

export const updateAccountRequestSchema = z.object({
  toUpdate: z.object({
    general: z
      .object({
        username: usernameSchema,
        name: nameSchema,
        bio: bioSchema.optional(),
      })
      .optional(),
    privacy: z
      .object({
        // username not customizable
        name: privacyRuleSchema.optional(),
        bio: privacyRuleSchema.optional(),
        lastSeen: privacyRuleSchema.optional(),
        seeProfilePhotos: privacyRuleSchema.optional(),
        inviteToRoom: privacyRuleSchema.optional(),
        seeFriends: privacyRuleSchema.optional(),
        canBeFriend: privacyRuleLimitedSchema.optional(),
      })
      .optional(),
  }),
});
export type UpdateAccountRequestType = z.infer<
  typeof updateAccountRequestSchema
>;

export const updateAccountResponseSchema = z.object({
  general: z
    .object({
      success: z.boolean(),
    })
    .optional(),
  privacy: z
    .object({
      success: z.boolean(),
    })
    .optional(),
});

export type UpdateAccountResponseType = z.infer<
  typeof updateAccountResponseSchema
>;

export const sessionReadRequestSchema = z.object({});
export type SessionReadRequestType = z.infer<typeof sessionReadRequestSchema>;

export const sessionReadResponseSchema = z.object({
  success: z.boolean(),
  sessionArr: z.array(
    z.object({
      deviceName: z.string().optional(),
      userAgent: z.string(),
      ip: z.string(),
      lastSeen: z.number(),
      isFrozen: z.boolean(),
      sessionId: z.string(),
      isCurrent: z.boolean(),
    }),
  ),
});

export type SessionReadResponseType = z.infer<typeof sessionReadResponseSchema>;

export const sessionDeleteRequestSchema = z.object({
  sessionId: z.string().or(z.literal("self")),
});
export type SessionDeleteRequestType = z.infer<
  typeof sessionDeleteRequestSchema
>;

export const sessionDeleteResponseSchema = z.object({
  success: z.boolean(),
  isExist: z.boolean().optional(),
});
export type SessionDeleteResponseType = z.infer<
  typeof sessionDeleteResponseSchema
>;

const maxMessageTimestamp = 2000000000000 as const; // TODO move to .env
const minMessageTimestamp = 1000000000000 as const; // TODO move to .env

const messageTimestampSchema = z
  .number()
  .finite()
  .safe()
  .gte(minMessageTimestamp)
  .lte(maxMessageTimestamp);

export const messageSchema = z.object({
  username: z.string().optional(),
  authorId: z.union([userIdSchema, selfIdSchema, serviceIdSchema]),
  content: z.object({ text: z.string().min(1) }),
  created: messageTimestampSchema,
  modified: messageTimestampSchema.optional(),
  targetId: userIdSchema.optional(), // For Service Message
  replyTo: userIdSchema.optional(),
});

export const messageDatesSchema = z.object({
  created: messageTimestampSchema,
  modified: messageTimestampSchema.optional(),
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
const roomTypeLimitedSchema = z.union([
  z.literal("public"),
  z.literal("private"),
  z.literal("single"),
]);
export const roomAboutSchema = z.string().max(80).optional();
const roomCreatedSchema = z.number();

export const readRoomInfoRequestSchema = z.object({
  roomId: roomIdSchema,
});
export type ReadRoomInfoRequestType = z.infer<typeof readRoomInfoRequestSchema>;

export const readRoomInfoResponseSchema = z.object({
  success: z.boolean(),
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
export type ReadRoomInfoResponseType = z.infer<
  typeof readRoomInfoResponseSchema
>;

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
export type RoomType = z.infer<typeof roomSchema>;

export const readRoomsRequestSchema = z.object({
  range: z.object({
    min: z.number().finite(),
    max: z.number().finite(),
  }),
});
export type ReadRoomsRequestType = z.infer<typeof readRoomsRequestSchema>;

export const readRoomsResponseSchema = z.object({
  success: z.boolean(),
  allCount: z.number(),
  items: z.array(roomSchema).optional(),
});
export type ReadRoomsResponseType = z.infer<typeof readRoomsResponseSchema>;

export const searchRoomsRequestSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  q: z.string().max(16),
});
export type SearchRoomsRequestType = z.infer<typeof searchRoomsRequestSchema>;

export const searchRoomsResponseSchema = z
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
export type SearchRoomsResponseType = z.infer<typeof searchRoomsResponseSchema>;

export const createRoomRequestSchema = z.object({
  roomInfo: z.object({
    name: z.string().min(4),
    type: roomTypeLimitedSchema,
    about: roomAboutSchema,
  }),
});
export type CreateRoomRequestType = z.infer<typeof createRoomRequestSchema>;

export const createRoomResponseSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema.optional(),
});
export type CreateRoomResponseType = z.infer<typeof createRoomResponseSchema>;

export const updateRoomRequestSchema = z.object({
  roomId: roomIdSchema,
  info: z.object({
    name: roomNameSchema.optional(),
    type: z
      .union([z.literal("public"), z.literal("private"), z.literal("single")])
      .optional(),
    about: roomAboutSchema.optional(),
    creatorId: userIdSchema.optional(),
  }),
});
export type UpdateRoomRequestType = z.infer<typeof updateRoomRequestSchema>;

export const updateRoomResponseSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema.optional(),
});
export type UpdateRoomResponseType = z.infer<typeof updateRoomResponseSchema>;

export const deleteRoomRequestSchema = z.object({
  roomId: roomIdSchema,
});
export type DeleteRoomRequestType = z.infer<typeof deleteRoomRequestSchema>;

export const deleteRoomResponseSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema,
});
export type DeleteRoomResponseType = z.infer<typeof deleteRoomResponseSchema>;

export const leaveRoomRequestSchema = z.object({
  roomId: roomIdSchema,
});
export type LeaveRoomRequestType = z.infer<typeof leaveRoomRequestSchema>;

export const leaveRoomResponseSchema = z.object({
  success: z.boolean(),
  roomId: roomIdSchema,
});
export type LeaveRoomResponseType = z.infer<typeof leaveRoomResponseSchema>;

export const joinRoomRequestSchema = z.object({
  roomId: roomIdSchema,
});
export type JoinRoomRequestType = z.infer<typeof joinRoomRequestSchema>;

export const joinRoomResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  roomId: roomIdSchema,
});
export type JoinRoomResponseType = z.infer<typeof joinRoomResponseSchema>;

export const getRoomMembersRequestSchema = z.object({
  roomId: roomIdSchema,
});
export type GetRoomMembersRequestType = z.infer<
  typeof getRoomMembersRequestSchema
>;

export const getRoomMembersResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  isEmpty: z.boolean(),
  roomId: roomIdSchema,
  users: readAccountResponseSchema.array().optional(),
});
export type GetRoomsMembersResponseType = z.infer<
  typeof getRoomMembersResponseSchema
>;

export const getRoomBlockedUsersRequestSchema = z.object({
  roomId: roomIdSchema,
});
export type GetRoomBlockedUsersRequestType = z.infer<
  typeof getRoomBlockedUsersRequestSchema
>;

export const getRoomBlockedUsersResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  isEmpty: z.boolean(),
  roomId: roomIdSchema,
  users: readAccountResponseSchema.array().optional(),
});
export type GetRoomBlockedUsersResponseType = z.infer<
  typeof getRoomBlockedUsersResponseSchema
>;

export const roomKickMemberRequestSchema = z.object({
  roomId: roomIdSchema,
  userIds: userIdSchema.array(),
});
export type RoomKickMemberRequestType = z.infer<
  typeof roomKickMemberRequestSchema
>;

export const roomKickMemberResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});
export type RoomKickMemberResponseType = z.infer<
  typeof roomKickMemberResponseSchema
>;

export const roomBanMemberRequestSchema = z.object({
  roomId: roomIdSchema,
  userIds: userIdSchema.array(),
});
export type RoomBanMemberRequestType = z.infer<
  typeof roomBanMemberRequestSchema
>;

export const roomBanMemberResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});
export type RoomBanMemberResponseType = z.infer<
  typeof roomBanMemberResponseSchema
>;

export const roomUnbanMemberRequestSchema = z.object({
  roomId: roomIdSchema,
  userIds: userIdSchema.array(),
});
export type RoomUnbanMemberRequestType = z.infer<
  typeof roomUnbanMemberRequestSchema
>;

export const roomUnbanMemberResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});
export type RoomUnbanMemberResponseType = z.infer<
  typeof roomUnbanMemberResponseSchema
>;

export const roomSearchUsersToInviteRequestSchema = z.object({
  roomId: roomIdSchema,
  limit: z.number().finite(),
  offset: z.number().finite(),
  q: z.string().max(16),
});
export type RoomSearchUsersToInviteRequestType = z.infer<
  typeof roomSearchUsersToInviteRequestSchema
>;

export const roomSearchUsersToInviteResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
  isEmpty: z.boolean().optional(),
  users: readAccountResponseSchema.array().optional(),
});
export type RoomSearchUsersToInviteResponseType = z.infer<
  typeof roomSearchUsersToInviteResponseSchema
>;

export const roomInviteUserRequestSchema = z.object({
  roomId: roomIdSchema,
  userIds: userIdSchema.array(),
});
export type RoomInviteUserRequestType = z.infer<
  typeof roomInviteUserRequestSchema
>;

export const roomInviteUserResponseSchema = z.object({
  success: z.boolean(),
  access: z.boolean(),
});

export type RoomInviteUserResponseType = z.infer<
  typeof roomInviteUserResponseSchema
>;

export const getMessagesRequestSchema = z
  .object({
    roomId: roomIdSchema,
    indexRange: z.object({ min: z.number(), max: z.number() }),
  })
  .or(
    z.object({
      roomId: roomIdSchema,
      createdRange: z.object({ min: z.number(), max: z.number().optional() }),
    }),
  );
export type GetMessagesRequestType = z.infer<typeof getMessagesRequestSchema>;

export const getMessagesResponseSchema = z.object({
  access: z.boolean(),
  success: z.boolean(),
  roomId: roomIdSchema,
  allCount: z.number(),
  messages: z.array(messageSchema).optional(),
});
export type GetMessagesResponseType = z.infer<typeof getMessagesResponseSchema>;

export const compareMessagesRequestSchema = z.object({
  roomId: roomIdSchema,
  toCompare: z
    .object({
      created: z.number(),
      modified: z.number().optional(),
    })
    .array(),
});
export type CompareMessagesRequestType = z.infer<
  typeof compareMessagesRequestSchema
>;

export const compareMessagesResponseSchema = z.object({
  access: z.boolean(),
  success: z.boolean(),
  roomId: roomIdSchema,
  isEqual: z.boolean(),
  toRemove: z.array(messageTimestampSchema).optional(),
  toUpdate: z.array(messageSchema).optional(),
});
export type CompareMessagesResponseType = z.infer<
  typeof compareMessagesResponseSchema
>;

export const sendMessageRequestSchema = z.object({
  roomId: roomIdSchema,
  message: z.object({
    content: z.object({
      text: z.string(),
    }),
  }),
});
export type SendMessageRequestType = z.infer<typeof sendMessageRequestSchema>;

export const sendMessageResponseSchema = z
  .object({
    access: z.boolean(),
    success: z.boolean(),
  })
  .or(
    z.object({
      access: z.literal(true),
      success: z.literal(true),
      created: messageTimestampSchema,
    }),
  );
export type SendMessageResponseType = z.infer<typeof sendMessageResponseSchema>;

export const updateMessageRequestSchema = z.object({
  roomId: roomIdSchema,
  message: z.object({
    content: z.object({ text: z.string() }),
    created: z.number(),
  }),
});
export type UpdateMessageRequestType = z.infer<
  typeof updateMessageRequestSchema
>;

export const updateMessageResponseSchema = z
  .object({
    access: z.literal(false),
    success: z.literal(false),
  })
  .or(
    z.object({
      access: z.literal(true),
      success: z.literal(true),
      dates: z.object({
        created: messageTimestampSchema,
        modified: messageTimestampSchema,
      }),
    }),
  );
export type UpdateMessageResponseType = z.infer<
  typeof updateMessageResponseSchema
>;

export const deleteMessageRequestSchema = z.object({
  roomId: roomIdSchema,
  created: z.number(),
});
export type DeleteMessageRequestType = z.infer<
  typeof deleteMessageRequestSchema
>;

export const deleteMessageResponseSchema = z.object({
  access: z.boolean(),
  success: z.boolean(),
});

export type DeleteMessageResponseType = z.infer<
  typeof deleteMessageResponseSchema
>;
