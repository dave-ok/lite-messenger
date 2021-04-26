import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "./store/utils/thunkCreators";
import { AuthForm, AuthLayout, AuthNav } from "./components/AuthLayout";

const Login = (props) => {
  const { user, login } = props;
  const history = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  const Nav = (
    <AuthNav
      prompt={"Don't have an account?"}
      buttonCaption={"Register"}
      onButtonClick={() => history.push("/register")}
    />
  );
  const Form = (
    <AuthForm
      onSubmit={handleLogin}
      buttonCaption={"Login"}
      headerText={"Welcome Back!"}
    />
  );

  return <AuthLayout Nav={Nav} Form={Form} />;
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
