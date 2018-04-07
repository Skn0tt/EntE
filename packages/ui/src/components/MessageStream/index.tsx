import * as React from "react";
import styles from "./styles";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar/Snackbar";
import { IconButton } from "material-ui";
import { Close as CloseIcon } from "material-ui-icons";
import { AppState, removeMessage, getMessages } from "ente-redux";

/**
 * # Component Types
 */
interface StateProps {
  messages: String[];
}
const mapStateToProps = (state: AppState) => ({
  messages: getMessages(state)
});

interface DispatchProps {
  removeMessage(index: number): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  removeMessage: (index: number) => dispatch(removeMessage(index))
});

type Props = StateProps & DispatchProps & WithStyles;

/**
 * # Component
 */
export const MessageStream: React.SFC<Props> = props => {
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

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MessageStream)
);
