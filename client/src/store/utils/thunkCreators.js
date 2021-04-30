import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  markConversationMessagesAsRead,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  return config;
});

axios.defaults.withCredentials = true;

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.connect();
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);

    dispatch(gotUser(data));
    socket.connect();
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);

    dispatch(gotUser(data));
    socket.connect();
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");

    dispatch(gotUser({}));
    socket.emit("logout", id);
    socket.disconnect();
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

const notifyLastReadmessage = ({
  lastSeenMessageId,
  conversationId,
  senderId,
}) => {
  socket.emit("last-seen-message", {
    lastSeenMessageId,
    conversationId,
    senderId,
  });
};

export const updateReadMessages = (conversation) => async (dispatch) => {
  try {
    // find ids of unread messages by this user in this conversation
    const conversationId = conversation.id;
    const messageIds = conversation.messages.reduce((ids, message) => {
      if (!message.read) {
        ids.push(message.id);
      }
      return ids;
    }, []);

    if (!messageIds.length) return;

    // send messageIds to server
    const {
      data: { success, lastSeenMessageId },
    } = await axios.put("/api/messages", {
      messageIds,
      conversationId,
    });

    // if update succeeded update all unread messages in store
    if (success) {
      dispatch(markConversationMessagesAsRead(conversationId));
    }

    const senderId = conversation.otherUser.id;

    notifyLastReadmessage({
      lastSeenMessageId,
      conversationId,
      senderId,
    });
  } catch (error) {
    console.error(error);
  }
};
