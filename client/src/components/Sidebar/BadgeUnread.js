import { Badge, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  badge: {
    top: "25%",
    right: 30,
    padding: "0 10px",
  },
});

const BadgeUnread = ({ count }) => {
  const classes = useStyles();
  return (
    <Badge
      badgeContent={count}
      color={"primary"}
      className={classes.badge}
    ></Badge>
  );
};

export default BadgeUnread;
