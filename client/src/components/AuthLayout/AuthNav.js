import {
  Box,
  ButtonBase,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link as RRLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Open Sans",
    fontSize: "14px",
  },
  button: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.face,
    fontSize: theme.typography.fontSize,
    height: "54px",
    borderRadius: "5px",
    filter: "drop-shadow(0px 2px 6px rgba(74,106,149,0.2))",
    fontWeight: 600,
    paddingLeft: "50px",
    paddingRight: "50px",
  },
  prompt: {
    color: theme.palette.secondary.main,
    fontWeight: 400,
  },
}));

const AuthNav = ({ buttonCaption, prompt, url = "/" }) => {
  const classes = useStyles();
  return (
    <Grid
      item
      container
      justify={"flex-end"}
      spacing={2}
      className={classes.root}
    >
      <Grid item>
        <Box
          height="100%"
          alignItems="center"
          display="flex"
          className={classes.prompt}
          mr-md={3}
        >
          <Typography>{prompt}</Typography>
        </Box>
      </Grid>
      <Grid item>
        <ButtonBase component={RRLink} to={url} className={classes.button}>
          {buttonCaption}
        </ButtonBase>
      </Grid>
    </Grid>
  );
};

export default AuthNav;
