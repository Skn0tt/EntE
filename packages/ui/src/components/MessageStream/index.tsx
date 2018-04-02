import * as React from "react";
import styles from "./styles";
import withStyles, { WithStyles } from "material-ui/styles/withStyles";
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar/Snackbar";
import { IconButton } from "material-ui";
import { Close as CloseIcon } from "material-ui-icons";
import { AppState, removeMessage, getMessages } from "ente-redux";

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

const MessageStream: React.SFC<Props> = props => (
  <React.Fragment>
    {props.messages.map((msg, index) => (
      <Snackbar
        key={index}
        message={<span>{msg}</span>}
        autoHideDuration={6000}
        onClose={(event, reason) =>
          reason !== "clickaway" && props.removeMessage(index)
        }
        open
        action={
          <IconButton
            onClick={() => props.removeMessage(index)}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        }
      />
    ))}
  </React.Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MessageStream)
);
