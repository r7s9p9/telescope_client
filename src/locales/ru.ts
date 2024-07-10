export const localeRU = {
  error: {
    REQUEST_COMMON_MESSAGE:
      "Ошибка на стороне клиента. Попробуйте перезапустить страницу" as const,
    RESPONSE_COMMON_MESSAGE:
      "Этот функционал временно недоступен. Пожалуйста попробуйте позже" as const,
    UNKNOWN_MESSAGE:
      "Что-то пошло не так. Пожалуйста попробуйте позже" as const,
  },

  schema: {
    email: {
      NOT_EMAIL: "Некорректный почтовый адрес" as const,
      TOO_LONG: (count: number) =>
        `Почтовый адрес должен быть не короче ${count} символов` as const,
    },
    username: {
      TOO_SHORT: (count: number) =>
        `Юзернейм должен быть не длиннее ${count} символов` as const,
      TOO_LONG: (count: number) =>
        `Юзернейм должен быть не короче ${count} символов` as const,
    },
    name: {
      TOO_SHORT: (count: number) =>
        `Имя должно быть не короче ${count} символов` as const,
      TOO_LONG: (count: number) =>
        `Имя должно быть не длиннее ${count} символов` as const,
    },
    bio: {
      TOO_LONG: (count: number) =>
        `Био не должно быть длиннее ${count} символов` as const,
    },
    password: {
      TOO_SHORT: (count: number) =>
        `Пароль должен быть не короче ${count} символов` as const,
      TOO_LONG: (count: number) =>
        `Пароль должен быть не длиннее ${count} символов` as const,
    },
    code: {
      WRONG_LENGTH: (count: number) =>
        `Код подтверждения должен содержать ${count} символов` as const,
    },
  },

  auth: {
    EMAIL_LABEL: "Почта" as const,
    PASSWORD_LABEL: "Пароль" as const,
    USERNAME_LABEL: "Юзернейм" as const,
    CODE_LABEL: "Код" as const,

    SIGNIN_TITLE: "Войти в аккаунт" as const,
    SIGNUP_TITLE: "Создать аккаунт" as const,
    CODE_TITLE: "Почти готово" as const,
    CODE_MESSAGE: "Пожалуйста введите код, отправленный в Ваш аккаунт" as const,

    GO_TO_SIGN_UP_TITLE: "Нужен аккаунт?" as const,
    GO_TO_SIGN_UP_TEXT: "Зарегистрироваться" as const,
    GO_TO_SIGN_IN_TITLE: "Нужно войти?" as const,
    GO_TO_SIGN_IN_TEXT: "Войти в аккаунт" as const,

    BACK_FROM_CODE_TITLE: "Не Ваш аккаунт?" as const,
    BACK_FROM_CODE_TEXT: "Вернуться назад" as const,

    SIGN_IN_ACTION: "Залогиниться" as const,
    SIGN_UP_ACTION: "Зарегистрироваться" as const,
    CODE_ACTION: "Продолжить" as const,
  },

  authNotification: {
    INCORRECT_CREDENTIALS: "Вы ввели некорректный пароль или почту" as const,
    BAD_CODE: "Некорректный код" as const,
    EMAIL_EXISTS: "Эта почта уже существует" as const,
    USERNAME_EXISTS: "Такое юзернейм уже существует" as const,
    OUTDATED_EMAIL: "Адрес почты уже не действителен" as const,
    REGISTER_SUCCESS:
      "Вы успешно зарегистрировались! Пожалуйста войдите в аккаунт" as const,
    LOGGED_OUT: "Вы успешно вышли из аккаунта" as const,
    SESSION_BLOCKED:
      "Текущая сессия была заблокирована - возможно с другого устройства, или вы длительное время не заходили в свой аккаунт" as const,
  },

  panel: {
    PROFILE_LABEL: "Профиль" as const,
    ROOMS_LABEL: "Комнаты" as const,
    FRIENDS_LABEL: "Друзья" as const,
    SETTINGS_LABEL: "Настройки" as const,
  },

  profile: {
    TITLE_SELF: "Ваш профиль" as const,
    TITLE_USER: (username: string) => `Профиль @${username}`,
    TITLE_NOT_FOUND: "Не найдено" as const,

    DETAILS_NOT_FOUND: "Этот профиль не существует или был удален" as const,

    USERNAME_LABEL: "Юзернейм" as const,
    NAME_LABEL: "Имя" as const,
    BIO_LABEL: "Био" as const,

    INFO_HIDDEN: "Скрыто настройками конфиденциальности" as const,

    UPDATE_ACTION: "Обновить" as const,
    GO_BACK_ACTION: "Назад" as const,
  },

  profileNotification: {
    SUCCESS: "Информация профиля была успешно обновлена" as const,
    INCORRECT_USERID:
      "Такой профиль не может существовать. Возможно Вы перешли по некорректной ссылке" as const,
  },

  rooms: {
    TITLE: "Комнаты" as const,
    BUTTON_CREATE_LABEL: "Создать комнату" as const,

    SEARCH_PLACEHOLDER: "Поиск ..." as const,
    NO_ROOMS_FOUND: "Комнат не найдено" as const,
    FOUND_ITEM_NO_MEMBERS: "Нет участников" as const,
    FOUND_ITEM_ONE_MEMBER: "1 участник" as const,
    FOUND_ITEM_MEMBERS: (count: number) => `${count} участников`,

    NO_ROOMS_HEAD: "У Вас пока нет комнат" as const,
    NO_ROOMS_TAIL:
      "Создайте свою комнату или найдите публичную комнату и присоединитесь к ней" as const,
    NO_LAST_MESSAGE: "Нет сообщений" as const,

    LAST_MESSAGE_AUTHOR_YOU: "Вы:" as const,
    LAST_MESSAGE_AUTHOR_SERVICE: "Сервис:" as const,
  },

  topBar: {
    PUBLIC_TYPE: "Публичная" as const,
    PRIVATE_TYPE: "Приватная" as const,
    SINGLE_TYPE: "Одиночная" as const,
    SERVICE_TYPE: "Сервисная" as const,
    ROOM_TEXT: "комната" as const,
    NO_MEMBERS_TEXT: "нет участников" as const,
    ONE_MEMBER_TEXT: "1 участник" as const,
    MEMBERS_TEXT: "участники" as const,
  },

  bottomBar: {
    JOIN_ACTION: "Присоединиться" as const,

    TITLE_EDIT: "Редактирование" as const,
    LABEL_CLOSE_EDIT: "Отменить редактирование" as const,
    LABEL_SEND: "Отправить сообщение" as const,
  },

  bottomBarNotification: {
    UPDATE_MESSAGE_NO_RIGHT: "У Вас нет прав изменять это сообщение" as const,
    UPDATE_MESSAGE_FAIL:
      "Сообщение не было изменено. Возможно комната больше не существует или была удалена" as const,
    SEND_MESSAGE_NO_RIGHT: "У Вас недостаточно прав" as const,
    SEND_MESSAGE_FAIL:
      "Сообщение не было отправлено. Возможно комната больше не существует или была удалена" as const,
  },

  messages: {
    NO_MESSAGES_TEXT: "Здесь пока нет сообщений" as const,
    SELF_MESSAGE_TEXT: "Вы" as const,
    MESSAGE_EDITED_TEXT: "редактировано" as const,
    CONTEXT_MENU_REPLY_ACTION: "Ответить" as const,
    CONTEXT_MENU_EDIT_ACTION: "Редактировать" as const,
    CONTEXT_MENU_COPY_ACTION: "Копировать" as const,
    CONTEXT_MENU_DELETE_ACTION: "Удалить" as const,
  },

  messagesNotification: {
    DELETE_NO_RIGHT: "У Вас нет прав удалять это сообщение" as const,
    DELETE_FAIL:
      "Сообщение не было удалено. Возможно комната больше не существует или была удалена" as const,
  },

  createRoom: {
    POPUP_TITLE: "Создать комнату" as const,
    NAME_LABEL: "Имя" as const,
    TYPE_LABEL: "Тип" as const,
    ABOUT_LABEL: "Описание" as const,
    TYPE_PUBLIC_ITEM: "Публичная" as const,
    TYPE_PRIVATE_ITEM: "Приватная" as const,
    TYPE_SINGLE_ITEM: "Одиночная" as const,
    CREATE_ACTION: "Создать" as const,
  },

  actions: {
    SHOW_LABEL: "Действия" as const,

    ITEM_COPY_ACTION: "Скопировать ссылку" as const,

    ITEM_LEAVE_ROOM_ACTION: "Покинуть комнату" as const,
    LEAVE_POPUP_TITLE: "Покинуть комнату" as const,
    LEAVE_POPUP_QUESTION:
      "Вы действительно хотите выйти из этой комнаты?" as const,
    LEAVE_POPUP_CONFIRM: "Выйти" as const,
    LEAVE_POPUP_CANCEL: "Отменить" as const,

    ITEM_DELETE_ROOM_ACTION: "Удалить комнату" as const,
    DELETE_POPUP_TITLE: "Удалить комнату" as const,
    DELETE_POPUP_QUESTION:
      "Вы действительно хотите удалить эту комнату?" as const,
    DELETE_POPUP_CONFIRM: "Удалить" as const,
    DELETE_POPUP_CANCEL: "Отменить" as const,
  },

  actionsNotification: {
    LEAVE_SUCCESS: "Вы успешно вышли из комнаты" as const,
    DELETE_SUCCESS: "Вы успешно удалили комнату" as const,
    COPY_SUCCESS: "Ссылка на комнату скопирована" as const,
  },

  info: {
    TITLE: "Инфо" as const,
    BUTTON_CLOSE_LABEL: "Закрыть" as const,
  },

  properties: {
    NAME_LABEL: "Имя" as const,
    ABOUT_LABEL: "Описание" as const,
    TYPE_LABEL: "Тип" as const,
    CREATOR_LABEL: "Создатель" as const,
    CREATOR_VALUE_YOU: "Вы" as const,
    CREATOR_VALUE_SERVICE: "Сервис" as const,
    CREATED_LABEL: "Создано" as const,

    TYPE_PUBLIC_OPTION: "Публичная" as const,
    TYPE_PRIVATE_OPTION: "Приватная" as const,
    TYPE_SINGLE_OPTION: "Одиночная" as const,

    BUTTON_EDIT_LABEL: "Редактировать" as const,
    BUTTON_CANCEL_LABEL: "Отменить редактирование" as const,
    BUTTON_UPDATE_LABEL: "Обновить" as const,
  },

  members: {
    TITLE: "Участники" as const,
    NO_MEMBERS: "В этой комнате пока нет участников" as const,
    NAME_HIDDEN: "Имя скрыто" as const,
    STATUS_YOU: "вы" as const,
    STATUS_INVISIBLE: "скрыто" as const,
    STATUS_ONLINE: "в сети" as const,
    STATUS_OFFLINE: "оффлайн" as const,
    LAST_SEEN_TEXT: (str: string) => `Был в сети: ${str}` as const,

    CONTEXT_MENU_PROFILE_ACTION: "В профиль" as const,
    CONTEXT_MENU_COPY_ACTION: "Скопировать" as const,
    CONTEXT_MENU_KICK_ACTION: "Выгнать" as const,
    CONTEXT_MENU_BAN_ACTION: "Забанить" as const,
  },

  membersNotification: {
    COPY_SUCCESS: "Юзернейм скопирован в буфер обмена" as const,
    KICK_FAIL: (username: string) =>
      `Пользователь ${username} не может быть выгнан. Возможно он уже не является участником комнаты` as const,
    KICK_NO_RIGHT:
      "У Вас недостаточно прав чтобы выгнать этого пользователя" as const,
    KICK_SUCCESS: (username: string) =>
      `Пользователь ${username} успешно выгнан из комнаты` as const,
    BAN_NO_RIGHT:
      "У вас недостаточно прав чтобы забанить этого пользователя" as const,
    BAN_FAIL: (username: string) =>
      `Пользователь  ${username} не может быть забанен. Возможно он уже не является участником комнаты` as const,
    BAN_SUCCESS: (username: string) =>
      `Пользователь ${username} успешно забанен` as const,
  },

  blocked: {
    POPUP_TITLE: "Заблокированные пользователи" as const,
    BUTTON_REFRESH_LABEL: "Обновить" as const,
    NO_BLOCKED: "В этой комнате нет заблокированных пользователей" as const,

    STATUS_INVISIBLE: "скрыто" as const,
    STATUS_ONLINE: "в сети" as const,
    STATUS_OFFLINE: "оффлайн" as const,
    LAST_SEEN_TEXT: (str: string) => `Был в сети: ${str}` as const,

    CONTEXT_MENU_PROFILE_ACTION: "В профиль" as const,
    CONTEXT_MENU_COPY_ACTION: "Скопировать" as const,
    CONTEXT_MENU_UNBAN_ACTION: "Разбанить" as const,
  },

  blockedNotification: {
    COPY_SUCCESS: "Юзернейм скопирован в буфер обмена" as const,
    UNBAN_NO_RIGHT:
      "У Вас недостаточно прав чтобы разбанить этого пользователя" as const,
    UNBAN_FAIL: (username: string) =>
      `Пользователь ${username} не может быть разбанен. Возможно он уже не забанен` as const,
    UNBAN_SUCCESS: (username: string) =>
      `Пользователь ${username} успшено разбанен` as const,
  },

  invite: {
    POPUP_TITLE: "Пригласить пользователей" as const,
    SEARCH_PLACEHOLDER: "Введите юзернейм..." as const,
    NO_USERS: "По этому запросу пользователей не найдено" as const,

    NAME_HIDDEN: "Имя скрыто" as const,
    STATUS_INVISIBLE: "скрыто" as const,
    STATUS_ONLINE: "в сети" as const,
    STATUS_OFFLINE: "оффлайн" as const,
    LAST_SEEN_TEXT: (str: string) => `Был в сети: ${str}` as const,

    CONTEXT_MENU_PROFILE_ACTION: "В профиль" as const,
    CONTEXT_MENU_COPY_ACTION: "Скопировать" as const,
    CONTEXT_MENU_INVITE_ACTION: "Пригласить" as const,
  },

  inviteNotification: {
    COPY_SUCCESS: "Юзернейм скопирован в буфер обмена" as const,
    SEARCH_TO_INVITE_NO_RIGHT:
      "У Вас недостаточно прав чтобы пригласить этого пользователя" as const,
    INVITE_SUCCESS: (username: string) =>
      `Пользователь ${username} был успешно приглашен` as const,
    INVITE_NO_RIGHT:
      "У Вас недостаточно прав чтобы пригласить этого пользователя" as const,
    INVITE_FAIL: (username: string) =>
      `Пользователь ${username} не может быть приглашен. Возможно по причине параметров конфиденциальности либо его аккаунт уже удален` as const,
  },

  settings: {
    ITEM_PROFILE: "Мой профиль" as const,
    ITEM_PRIVACY: "Настройки приватности" as const,
    ITEM_SESSIONS: "Сессии" as const,
    ITEM_LANG: "Язык" as const,
    ITEM_LOGOUT: "Выйти" as const,

    LOGOUT_POPUP_TITLE: "Выход" as const,
    LOGOUT_POPUP_QUESTION: "Вы действительно хотите выйти?" as const,
    LOGOUT_POPUP_CONFIRM: "Выйти" as const,
    LOGOUT_POPUP_CANCEL: "Отменить" as const,
  },

  privacy: {
    TITLE_HEAD: "Настройки приватности" as const,
    TITLE_TAIL: "Кто может..." as const,

    ITEM_NAME: "Видеть мое имя" as const,
    ITEM_BIO: "Видеть мое био" as const,
    ITEM_LAST_SEEN: "Видеть когда я был в сети" as const,
    ITEM_PROFILE_PHOTOS: "Просматривать мои фото профиля" as const,
    ITEM_FRIENDS: "Видеть моих друзей" as const,
    ITEM_CAN_BE_FRIEND: "Стать моим другом" as const,
    ITEM_INVITE: "Пригласить меня в комнату" as const,

    ITEM_OPTION_EVERYBODY: "Все" as const,
    ITEM_OPTION_FRIENDS_OF_FRIENDS: "Друзья друзей" as const,
    ITEM_OPTION_FRIENDS: "Друзья" as const,
    ITEM_OPTION_NOBODY: "Никто" as const,

    BUTTON_UPDATE_LABEL: "Обновить" as const,
    BUTTON_GO_BACK_LABEL: "Назад" as const,
  },

  privacyNotification: {
    SUCCESS: "Информация профиля была успешно обновлена" as const,
  },

  sessions: {
    TITLE: "Сессии" as const,
    NO_CURRENT_SESSION:
      "Простите, но этот функционал сейчас недоступен. Пожалуйста попробуйте позже" as const,
    DEVICE_ITEM: "Устройство" as const,
    BROWSER_ITEM: "Браузер" as const,
    LAST_SEEN_TEXT: (str: string) => `Был в сети: ${str}` as const,
    STATUS_THIS_DEVICE: "Это устройство" as const,
    STATUS_BLOCKED: "Заблокирован" as const,
    STATUS_ONLINE: "В сети" as const,

    BUTTON_DELETE_LABEL: "Удалить сессию" as const,
    DELETE_POPUP_TITLE: "Удалить сессию" as const,
    DELETE_POPUP_QUESTION:
      "Вы действительно хотите удалить эту сессию?" as const,
    DELETE_POPUP_CONFIRM: "Удалить" as const,
    DELETE_POPUP_CANCEL: "Отменить" as const,

    BUTTON_GO_BACK_LABEL: "Назад" as const,
  },

  sessionsNotification: {
    SESSION_DELETE_FAIL:
      "Произошла ошибка при попытке удалить сессию. Пожалуйста попробуйте позже" as const,
    SESSION_DELETE_SUCCESS: "Сессия была успешно удалена" as const,
  },

  language: {
    TITLE: "Выберите язык" as const,
    OPTION_RU: "Русский" as const,
    OPTION_EN: "Английский" as const,
  },

  noMatch: {
    TITLE: "Ошибка 404" as const,
    SUBTITLE: "Судя по всему, этой страницы не существует" as const,
    MESSAGE_HEAD: "Тем не менее, Вы всегда можете вернуться" as const,
    MESSAGE_TAIL: "домой" as const,
  },

  errorBoundary: {
    TITLE: "Что-то пошло не так" as const,
    MESSAGE:
      "Обновите страницу, а если это не помогло, пишите нам на почту" as const,
  },
};
