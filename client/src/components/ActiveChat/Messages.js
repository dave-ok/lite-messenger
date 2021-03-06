import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const {
    messages,
    otherUser,
    userId,
    otherUsername,
    otherUserPhotoUrl,
    lastSeenMessageId,
  } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).calendar();
        const isLastRead = message.id === lastSeenMessageId;

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUserPhotoUrl={otherUserPhotoUrl}
            otherUsername={otherUsername}
            isLastRead={isLastRead}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
