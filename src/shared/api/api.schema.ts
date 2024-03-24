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

export const emailSchema = z.string().email();
export const usernameSchema = z.string().min(env.usernameRange.min).max(env.usernameRange.max);
export const passwordSchema = z.string().min(env.passwordRange.min).max(env.passwordRange.max);
export const codeSchema = z.string().min(6).max(6);

export const nameSchema = z.string().min(1).max(24);
export const bioSchema = z.string().min(1).max(80);
export const lastSeenSchema = z.string();

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const codeFormSchema = z.object({
  code: codeSchema
})

export const registerFormSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema
})

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
  general: z
    .object({
      username: usernameSchema.optional(),
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

const messageContent = z.object({ text: z.string().min(1) });
const messageAuthorId = userIdSchema.or(z.literal("service"));
const messageReplyTo = userIdSchema.optional();
const messageTargetId = userIdSchema.optional(); // For Service Message
const messageCreated = z.string();
const messageModified = z.string();

export const messageSchema = z.object({
  username: z.string().optional(),
  authorId: messageAuthorId,
  content: messageContent,
  created: messageCreated,
  modified: messageModified.optional(),
  targetId: messageTargetId.optional(),
  replyTo: messageReplyTo.optional(),
});

export type MessageType = z.infer<typeof messageSchema>;

const roomInListSchema = z.object({
  roomId: roomIdSchema,
  roomInfo: z.object({
    name: z.string(),
    type: z.union([
      z.literal("service").optional(),
      z.literal("private").optional(),
      z.literal("public").optional(),
      z.literal("single").optional(),
    ]),
    about: z.string(),
    creatorId: userIdSchema.or(z.literal("service")),
    created: z.string(),
  }),
  unreadCount: z.number(),
  lastMessage: messageSchema.optional(),
});

export const roomListSchema = z.object({
  dev: z
    .object({
      message: z.array(z.string()).optional(),
      error: z.array(z.string()).optional(),
    })
    .optional(),
  roomDataArr: z.array(roomInListSchema).optional(),
  isEmpty: z.boolean(),
  success: z.boolean(),
});

export type RoomInListType = z.infer<typeof roomInListSchema>;
export type RoomListType = z.infer<typeof roomListSchema>;

export const messageReadSchema = z.object({
  dev: z
    .object({
      message: z.array(z.string()).optional(),
      error: z.array(z.string()).optional(),
    })
    .optional(),
  messageArr: z.array(messageSchema).optional(),
  roomId: roomIdSchema,
  success: z.boolean(),
});

export type RoomDataType = z.infer<typeof messageReadSchema>;
