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
const messageAuthorId = userIdSchema
  .or(z.literal("service"))
  .or(z.literal("self"));
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

const roomsSchema = z.object({
  roomId: roomIdSchema,
  roomName: z.string(),
  unreadCount: z.number(),
  lastMessage: messageSchema.optional(),
});

export const roomListSchema = z.object({
  success: z.boolean(),
  allCount: z.number(),
  rooms: z.array(roomsSchema).optional(),
  dev: devSchema,
});

export type RoomInListType = z.infer<typeof roomsSchema>;
export type RoomListType = z.infer<typeof roomListSchema>;

export const messageReadSchema = z.object({
  access: accessSchema,
  success: successSchema,
  roomId: roomIdSchema,
  allCount: allCountSchema.optional(),
  messages: z.array(messageSchema).optional(),
  dev: devSchema,
});

export type MessageListType = z.infer<typeof messageReadSchema>;

export const messageCompareSchema = z.object({
  access: accessSchema,
  success: successSchema,
  roomId: roomIdSchema,
  isEqual: z.boolean(),
  toRemove: z.array(messageCreated).optional(),
  toUpdate: z.array(messageSchema).optional(),
  dev: devSchema,
});
