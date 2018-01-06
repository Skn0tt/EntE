import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import * as select from '../../redux/selectors';

import styles from './styles';
import { AppState } from '../../interfaces/index';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { CircularProgress, Grid } from 'material-ui';

interface IProps {
  authValid: boolean;
  authChecked: boolean;
}

type Props = IProps & WithStyles & RouteComponentProps<{}>;

const Loading: React.SFC<Props> = (props) => {
  const { classes } = props;
  const { state } = props.location;

  return (
    <Grid
      className={classes.root}
      container={true}
      direction="row"
      alignItems="center"
      justify="center"
    >
      {props.authChecked && <Redirect to={{ state, pathname: '/login' }} />}
      <Grid
        className={classes.item}
        item={true}
      >
        <CircularProgress
          size={100}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state: AppState) => ({
  authValid: select.isAuthValid(state),
  authChecked: select.wasAuthChecked(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Loading));
