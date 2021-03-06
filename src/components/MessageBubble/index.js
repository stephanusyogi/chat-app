import { makeStyles } from "@material-ui/core";
import moment from "moment";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: "0 16px 4px",
    paddingLeft: (props) => (props.isMe ? "40px" : "16px"),
    marginTop: "40px",
  },

  img: {
    position: "absolute",
    left: "-32px",
    margin: "0",
    height: "40px",
    width: "40px",
    top: "0",
  },

  bubble: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    maxWidth: "100%",
    borderRadius: "20px",
    backgroundColor: (props) => (props.isMe ? "#e0e0e0" : "#3c4252"),
    color: (props) => (props.isMe ? "rgba(0,0,0,.87)" : "#fff"),
    marginLeft: (props) => (props.isMe ? "auto" : "initial"),
  },

  timestamp: {
    position: "absolute",
    width: "100%",
    fontSize: "11px",
    marginTop: "8px",
    top: "100%",
    left: "0",
    whiteSpace: "nowrap",
    color: "#999",
    textAlign: (props) => (props.isMe ? "right" : "left"),
  },
}));

const MessageBubble = (props) => {
  const classes = useStyles(props);
  const { isMe, message } = props;

  return (
    <div className={classes.root}>
      {!isMe && (
        <img
          className={classes.img}
          alt=""
          referrerPolicy="no-referrer"
          src={message.fromUser.picture}
        />
      )}
      <div className={classes.bubble}>
        <div>{message.message}</div>
        <div className={classes.timestamp}>
          {moment(message.createdAt).format("L LT")}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
