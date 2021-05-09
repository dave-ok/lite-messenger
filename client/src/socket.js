import { io } from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setLastReadMessage,
} from "./store/conversations";
import { updateReadMessages } from "./store/utils/thunkCreators";

const socket = io(window.location.origin, { autoConnect: false });

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    // get activeConversation from state and pass it in
    const { activeConversation } = store.getState();
    store.dispatch(
      setNewMessage(data.message, data.sender, activeConversation)
    );

    // check message senderId if same user in activeConversation
    const { conversations } = store.getState();
    const { senderId } = data.message;

    const activeConvo = conversations.find((convo) => {
      return convo.otherUser.username === activeConversation;
    });

    // if sender's message is in active conversation mark all messages as read
    if (activeConvo) {
      if (activeConvo.otherUser.id === senderId) {
        store.dispatch(updateReadMessages(activeConvo));
      }
    }
  });
  socket.on("last-seen-message", ({ conversationId, lastSeenMessageId }) => {
    store.dispatch(setLastReadMessage(conversationId, lastSeenMessageId));
  });
});
socket.on("connect_error", (error) => {
  // dispatch error to snackErrorBar
  console.log(error);
});

socket.on("disconnect", () => {
  console.log("disconnnected from server");
});

export default socket;
