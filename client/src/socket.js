import { io } from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  markSelectMessagesAsRead,
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
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("read-message", (conversationId, messageIds) => {
    store.dispatch(markSelectMessagesAsRead(conversationId, messageIds));
  });
});
socket.on("connect_error", (error) => {
  // dispatch error to snackErrorBar
  console.log(error);
});

export default socket;
