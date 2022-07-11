import React from "react";
import Typography from "@material-ui/core/Typography";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { useRecoilState } from "recoil";
import { selectedUserState } from "../../../recoil";
import { useAuth0 } from "@auth0/auth0-react";

function MessageHeader() {
  const [selectedUser] = useRecoilState(selectedUserState);
  const { logout } = useAuth0();

  return (
    <Typography variant="h6" noWrap style={{ width: "100%" }}>
      {selectedUser?.name}
      <ExitToApp
        style={{ float: "right" }}
        onClick={() =>
          logout({
            returnTo: process.env.REACT_APP_BASE_URL,
          })
        }
      ></ExitToApp>
    </Typography>
  );
}

export default MessageHeader;
