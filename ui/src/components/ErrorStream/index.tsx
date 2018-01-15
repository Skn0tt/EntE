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
import { removeError } from '../../redux/actions';

interface StateProps {
  errors: Error[];
}

interface DispatchProps {
  removeError(index: number): Action;
}

type Props = StateProps & DispatchProps & WithStyles;

const ErrorStream: React.SFC<Props> = props => (
  <div>
    {props.errors.map((error, index) => (
      <Snackbar
        key={index}
        message={<span>{error.message}</span>}
        autoHideDuration={6000}
        onClose={() => props.removeError(index)}
        open
        action={
          <IconButton
            onClick={() => props.removeError(index)}
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
  errors: select.getErrors(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  removeError: (index: number) => dispatch(removeError(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ErrorStream));
