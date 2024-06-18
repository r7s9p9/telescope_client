export const serverResponse = {
  auth: {
    register: { body: { success: true }, init: { status: 201 } },
    login: { body: { success: true }, init: { status: 200 } },
    code: { body: { success: true }, init: { status: 200 } },
  },
  session: { body: { success: true, isExist: true }, init: { status: 200 } },
  account: {
    read: {
      body: {
        targetUserId: "self",
        general: {
          username: "test username",
          name: "test name",
          bio: "test bio",
        },
      },
      init: { status: 200 },
    },
  },
};
