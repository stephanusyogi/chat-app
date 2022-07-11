import React from "react";
import { useRecoilState } from "recoil";
import { selectedUserState } from "../../../recoil";
import { gql, useSubscription } from "@apollo/client";
import MessageBubble from "./../../../components/MessageBubble/index";
import { useAuth0 } from "@auth0/auth0-react";

const GET_MESSAGES = gql`
  subscription MyQuery($where: messages_bool_exp = {}) {
    messages(where: $where, order_by: { createdAt: asc }) {
      id
      fromUserId
      message
      fromUser {
        name
        picture
      }
      createdAt
    }
  }
`;

function Message() {
  const [selectedUser] = useRecoilState(selectedUserState);
  const { user } = useAuth0();

  let parameter = { where: {} };
  if (selectedUser && !selectedUser.id) {
    parameter.where = {
      toUserId: {
        _is_null: true,
      },
    };
  } else if (selectedUser && selectedUser.id) {
    parameter.where = {
      _or: [
        {
          fromUserId: {
            _eq: user.sub,
          },
          toUserId: {
            _eq: selectedUser.id,
          },
        },
        {
          fromUserId: {
            _eq: selectedUser.id,
          },
          toUserId: {
            _eq: user.sub,
          },
        },
      ],
    };
  }

  const { data } = useSubscription(GET_MESSAGES, { variables: parameter });

  setTimeout(() => {
    const cb = document.getElementById("chat-content").parentElement;
    if (cb) {
      cb.scrollTop = cb.scrollHeight;
    }
  }, 200);

  return (
    <div id="chat-content">
      {data?.messages.map((m) => {
        return (
          <MessageBubble
            key={m.id}
            message={m}
            isMe={user.sub === m.fromUserId}
          ></MessageBubble>
        );
      })}
    </div>
  );
}

export default Message;
