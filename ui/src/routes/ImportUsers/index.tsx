import * as React from 'react';
import styles from './styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { Dialog, Grid } from 'material-ui';
import { withMobileDialog } from 'material-ui/Dialog';
import { connect } from 'react-redux';
import { AppState } from '../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { RouteComponentProps } from 'react-router';

interface StateProps {}
const mapStateToProps = (state: AppState) => ({});

interface DispatchProps {}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

interface InjectedProps {
  fullScreen: boolean;
}

type Props = DispatchProps & StateProps & WithStyles & InjectedProps & RouteComponentProps<{}>;

const ImportUsers: React.SFC<Props> = props => (
  <Dialog
    fullScreen={props.fullScreen}
    onClose={() => props.history.goBack()}
    open
  >
    <Grid container>
      <Grid item>
      </Grid>
    </Grid>
  </Dialog>
);

export default
  connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
  withMobileDialog<Props>()(
    ImportUsers,
  )));
