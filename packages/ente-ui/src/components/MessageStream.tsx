/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import { IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { AppState, removeMessage, getMessages } from "../redux";

/**
 * # Component Types
 */
interface MessageStreamStateProps {
  messages: string[];
}
const mapStateToProps = (state: AppState) => ({
  messages: getMessages(state)
});

interface MessageStreamDispatchProps {
  removeMessage(index: number): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  removeMessage: (index: number) => dispatch(removeMessage(index))
});

type MessageStreamProps = MessageStreamStateProps & MessageStreamDispatchProps;

/**
 * # Component
 */
export const MessageStream: React.SFC<MessageStreamProps> = props => {
  const { messages, removeMessage } = props;

  return (
    <>
      {messages.map((msg, i) => (
        <Snackbar
          key={i}
          message={<span>{msg}</span>}
          autoHideDuration={6000}
          onClose={(_, reason) => reason !== "clickaway" && removeMessage(i)}
          open
          action={
            <IconButton
              onClick={() => removeMessage(i)}
              color="inherit"
              className={"remove" + i}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      ))}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageStream);
