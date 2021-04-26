import {
  Box,
  ButtonBase,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    fontFamily: "Open Sans",
    fontSize: "14px",
  },
  button: {
    color: "#3A8DFF",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    height: "54px",
    borderRadius: "5px",
    filter: "drop-shadow(0px 2px 6px rgba(74,106,149,0.2))",
    fontWeight: 600,
    paddingLeft: "50px",
    paddingRight: "50px",
  },
  prompt: {
    color: "#b0b0b0",
    fontWeight: 400,
  },
});

const AuthNav = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Grid container justify={"flex-end"} spacing={2}>
      <Grid item>
        <Box
          height="100%"
          alignItems="center"
          display="flex"
          className={classes.prompt}
          mr={3}
        >
          <Typography>Already have an account?</Typography>
        </Box>
      </Grid>
      <Grid item>
        <ButtonBase
          className={classes.button}
          size={"large"}
          onClick={() => history.push("/register")}
        >
          Register
        </ButtonBase>
      </Grid>
    </Grid>
  );
};

export default AuthNav;
