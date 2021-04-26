import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "./store/utils/thunkCreators";
import { AuthForm, AuthLayout, AuthNav } from "./components/AuthLayout";

const Signup = (props) => {
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});
  const history = useHistory();

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  const Nav = (
    <AuthNav
      prompt={"Already have an account?"}
      buttonCaption={"Login"}
      onButtonClick={() => history.push("/login")}
    />
  );
  const Form = (
    <AuthForm
      onSubmit={handleRegister}
      buttonCaption={"Create"}
      headerText={"Create an account."}
      formErrorMessage={formErrorMessage}
      isRegister={true}
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
