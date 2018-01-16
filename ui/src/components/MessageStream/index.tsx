import * as React from 'react';
import styles from './styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { AppState } from '../../interfaces/index';
import * as select from '../../redux/selectors';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { IconButton } from 'material-ui';
import { Close as CloseIcon } from 'material-ui-icons';
import { removeMessage } from '../../redux/actions';

interface StateProps {
  messages: String[];
}

interface DispatchProps {
  removeMessage(index: number): Action;
}

type Props = StateProps & DispatchProps & WithStyles;

const MessageStream: React.SFC<Props> = props => (
  <div>
    {props.messages.map((msg, index) => (
      <Snackbar
        key={index}
        message={<span>{msg}</span>}
        autoHideDuration={6000}
        onClose={() => props.removeMessage(index)}
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
  </div>
);

const mapStateToProps = (state: AppState) => ({
  messages: select.getMessages(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  removeMessage: (index: number) => dispatch(removeMessage(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageStream));
