import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import * as select from '../../redux/selectors';

import styles from './styles';
import { AppState } from '../../interfaces/index';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Redirect } from 'react-router';
import { CircularProgress, Grid } from 'material-ui';

interface Props {
  authValid: boolean;
  authChecked: boolean;
}
const Loading: React.SFC<Props & WithStyles> = (props) => (
  <Grid
    className={props.classes.root}
    container={true}
    direction="row"
    alignItems="center"
    justify="center"
  >
    {props.authChecked && <Redirect to="/login" />}
    <Grid
      className={props.classes.item}
      item={true}
    >
      <CircularProgress
        size={100}
      />
    </Grid>
  </Grid>
);

const mapStateToProps = (state: AppState) => ({
  authValid: select.isAuthValid(state),
  authChecked: select.wasAuthChecked(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Loading));
