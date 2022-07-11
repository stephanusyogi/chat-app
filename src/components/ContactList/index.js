import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  img: {
    height: "40px",
    marginRight: theme.spacing(2),
  },
}));

const ContactList = (props) => {
  const classes = useStyles(props);
  const { user } = props;

  return (
    <ListItem button className={classes.root}>
      <img
        alt=""
        src={user.picture}
        className={classes.img}
        referrerPolicy="no-referrer"
      />
      <ListItemText primary={user.name} />
    </ListItem>
  );
};

export default ContactList;
