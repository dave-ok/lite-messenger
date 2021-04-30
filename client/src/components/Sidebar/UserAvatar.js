import { Avatar, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  profilePic: ({ micro }) => ({
    height: micro ? 22 : 44,
    width: micro ? 22 : 44,
  }),
});

const UserAvatar = ({ username, photoUrl, micro = true, visible = false }) => {
  const classes = useStyles({ micro });
  return visible ? (
    <Avatar
      alt={username}
      src={photoUrl}
      className={classes.profilePic}
    ></Avatar>
  ) : null;
};

export default UserAvatar;
