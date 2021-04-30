export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    if (message.senderId === sender.id) newConvo.unreadMessages = 1;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };

      // mark the message as read immediately if it is in the active conversation
      if (convoCopy.otherUser.id === message.senderId) {
        if (activeConversation === convoCopy.otherUser.username) {
          message.read = true;
        } else {
          convoCopy.unreadMessages += 1;
        }
      }

      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const markConvoMessagesAsRead = (state, id) => {
  return state.map((convo) => {
    if (convo.id === id) {
      const convoCopy = { ...convo };
      convoCopy.messages.map((message) => {
        message.read = true;
        return message;
      });

      convoCopy.unreadMessages = 0;
      return convoCopy;
    }

    return convo;
  });
};

export const setLastReadMessageId = (state, conversationId, messageId) => {
  return state.map((convo) => {
    if (conversationId === convo.id) {
      const convoCopy = { ...convo };
      convoCopy.lastReadMessageId = messageId;

      return convoCopy;
    }

    return convo;
  });
};

export const markMessagesAsRead = (state, convoId, messageIds = []) => {
  return state.map((convo) => {
    if (convo.id === convoId) {
      const convoCopy = { ...convo };

      // let's track unread messages to avoid looping twice
      let unreadMessages = 0;
      convoCopy.messages.map((message) => {
        if (messageIds.includes(message.id)) message.read = true;
        if (!message.read) {
          unreadMessages += 1;
        }
        return message;
      });

      convoCopy.unreadMessages = unreadMessages;
      return convoCopy;
    }

    return convo;
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};
