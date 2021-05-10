import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import {
  logout,
  fetchConversations,
  updateReadMessages,
  getOnlineUsers,
} from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const styles = {
  root: {
    height: "97vh",
  },
};

const Home = ({ classes, ...props }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(true);
  }, [props.user.id]);

  const { activeConversation, conversations, markAllMessagesAsRead } = props;
  const { fetchConversations, getOnlineUsers } = props;

  useEffect(() => {
    // mark all messages as read
    const convo = conversations.find(
      (convo) => convo.otherUser.username === activeConversation
    );

    if (convo) markAllMessagesAsRead(convo);
  }, [activeConversation, conversations, markAllMessagesAsRead]);

  useEffect(() => {
    fetchConversations();
    getOnlineUsers();
  }, [fetchConversations, getOnlineUsers]);

  const handleLogout = async () => {
    await props.logout(props.user.id);
  };
  if (!props.user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to="/login" />;
    return <Redirect to="/register" />;
  }
  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
    activeConversation: state.activeConversation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
    markAllMessagesAsRead: (convo) => {
      dispatch(updateReadMessages(convo));
    },
    getOnlineUsers: () => {
      dispatch(getOnlineUsers());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
