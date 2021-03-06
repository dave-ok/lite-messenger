import React, { Component } from "react";
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.id !== prevProps.user.id) {
      this.setState({
        isLoggedIn: true,
      });
    }

    if (this.props.activeConversation !== prevProps.activeConversation) {
      // mark all messages as read
      const convo = this.props.conversations.find(
        (convo) => convo.otherUser.username === this.props.activeConversation
      );

      if (convo) this.props.markAllMessagesAsRead(convo);
    }
  }

  componentDidMount() {
    this.props.fetchConversations();
    this.props.getOnlineUsers();
  }

  handleLogout = async () => {
    await this.props.logout(this.props.user.id);
  };

  render() {
    const { classes } = this.props;
    if (!this.props.user.id) {
      // If we were previously logged in, redirect to login instead of register
      if (this.state.isLoggedIn) return <Redirect to="/login" />;
      return <Redirect to="/register" />;
    }
    return (
      <>
        {/* logout button will eventually be in a dropdown next to username */}
        <Button className={classes.logout} onClick={this.handleLogout}>
          Logout
        </Button>
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <SidebarContainer />
          <ActiveChat />
        </Grid>
      </>
    );
  }
}

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
