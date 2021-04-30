import { io } from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setLastReadMessage,
} from "./store/conversations";

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
  });
  socket.on("last-message-read", (conversationId, lastReadMessageId) => {
    store.dispatch(setLastReadMessage(conversationId, lastReadMessageId));
  });
});
socket.on("connect_error", (error) => {
  // dispatch error to snackErrorBar
  console.log(error);
});

export default socket;
