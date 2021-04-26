import {
  Box,
  Button,
  InputLabel,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
  },
  formGrid: {
    padding: "5% 15%",
  },
  header: {
    textAlign: "left",
    fontSize: "26px",
    lineHeight: "40px",
    fontWeight: 600,
    marginBottom: "20px",
  },
  inputField: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "25px",
  },
  inputLabel: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#b0b0b0",
    fontWeight: 400,
  },
  button: {
    height: "56px",
    color: "#ffffff",
    backgroundColor: "#3a8dff",
    borderRadius: "3px",
    fontSize: "16px",
    fontWeight: "bold",
    width: "160px",
  },
  buttonBox: {
    textAlign: "center",
  },
});

const AuthForm = ({
  onSubmit,
  showEmail = false,
  buttonCaption,
  headerText,
}) => {
  const classes = useStyles();

  return (
    <form onSubmit={onSubmit} className={classes.root}>
      <Box flexDirection="column" className={classes.formGrid} display="flex">
        <div className={classes.header}>
          <h2>{headerText}</h2>
        </div>

        <div>
          <InputLabel className={classes.inputLabel} htmlFor="username">
            Username
          </InputLabel>
          <TextField
            aria-label="username"
            name="username"
            type="text"
            fullWidth
            className={classes.inputField}
            required
          />
        </div>
        {showEmail && (
          <div>
            <InputLabel className={classes.inputLabel} htmlFor="email">
              E-mail address
            </InputLabel>
            <TextField
              aria-label="email"
              name="email"
              type="email"
              fullWidth
              className={classes.inputField}
              required
            />
          </div>
        )}
        <div>
          <InputLabel className={classes.inputLabel} htmlFor="password">
            Password
          </InputLabel>
          <TextField
            aria-label="password"
            type="password"
            name="password"
            fullWidth
            className={classes.inputField}
            required
          />
        </div>
        <div style={{ marginBottom: "40px" }}></div>

        <div className={classes.buttonBox}>
          <Button type="submit" variant="contained" className={classes.button}>
            {buttonCaption}
          </Button>
        </div>
      </Box>
    </form>
  );
};

export default AuthForm;
