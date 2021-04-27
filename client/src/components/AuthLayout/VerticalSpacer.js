import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    marginBottom: (props) => props.space + "px",
  },
});

const VerticalSpacer = ({ space = 10 }) => {
  const classes = useStyles({ space });
  return <div className={classes.root}></div>;
};

export default VerticalSpacer;
