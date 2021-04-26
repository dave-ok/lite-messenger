import { Box, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { AuthSidebar } from ".";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    fontFamily: "Open Sans",
  },
});
const AuthLayout = ({ Form, Nav }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={6} md={4}>
        <AuthSidebar />
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <Box p={4} height="80%">
          {Nav}
          {Form}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
