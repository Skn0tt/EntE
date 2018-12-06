/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { MessagesConsumer } from "../context/Messages";

interface MessageStreamOwnProps {}

type MessageStreamProps = MessageStreamOwnProps;

/**
 * # Component
 */
export const MessageStream: React.SFC<MessageStreamProps> = props => {
  return (
    <MessagesConsumer>
      {({ messages, removeMessage }) =>
        messages.map((msg, i) => (
          <Snackbar
            key={i}
            message={<span>{msg}</span>}
            autoHideDuration={6000}
            onClose={(_, reason) =>
              reason !== "clickaway" && removeMessage(msg)
            }
            open
            action={
              <IconButton
                onClick={() => removeMessage(msg)}
                color="inherit"
                className={"remove" + i}
              >
                <CloseIcon />
              </IconButton>
            }
          />
        ))
      }
    </MessagesConsumer>
  );
};

export default MessageStream;
