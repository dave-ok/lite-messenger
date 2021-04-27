import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import bgImg from "../../assets/images/bg-img.png";
import bubble from "../../assets/images/bubble.svg";

const useStyles = makeStyles({
  bgImg: {
    backgroundImage: `linear-gradient(to bottom, rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85)), url(${bgImg})`,
    backgroundRepeat: "no-repeat",
    height: "100%",
    backgroundSize: "cover",
  },
  mainGrid: {
    height: "100%",
  },
  text: {
    fontSize: "26px",
    lineHeight: "40px",
    color: "#ffffff",
    fontWeight: 400,
    fontFamily: "Open Sans",
    textAlign: "center",
    padding: "15%",
  },
  bubble: {
    marginBottom: "10px",
  },
});

const AuthSidebar = () => {
  const classes = useStyles();
  return (
    <Box className={classes.bgImg}>
      <Grid
        container
        direction={"column"}
        justify={"center"}
        className={classes.mainGrid}
      >
        <Grid item className={classes.bubble}>
          <Typography className={classes.text}>
            <img src={bubble} alt="bubble" />
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.text}>
            Converse with anyone with any language
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthSidebar;
