import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import * as select from '../../redux/selectors';

import styles from './styles';
import { AppState } from '../../interfaces/index';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Redirect } from 'react-router';

interface Props {
  authValid: boolean;
  authChecked: boolean;
}
const Loading: React.SFC<Props & WithStyles> = (props) => (
  <div>
    {props.authValid && <Redirect to="/" />}
    {props.authChecked && <Redirect to="/login" />}
    Loading!
  </div>
);

const mapStateToProps = (state: AppState) => ({
  authValid: select.isAuthValid(state),
  authChecked: select.wasAuthChecked(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Loading));
