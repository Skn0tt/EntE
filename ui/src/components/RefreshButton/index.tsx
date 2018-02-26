import * as React from 'react';
import { IconButton, CircularProgress } from 'material-ui';
import { Dispatch, connect } from 'react-redux';
import { Action } from 'redux';
import { getEntriesRequest, getUsersRequest, getSlotsRequest } from '../../redux/actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { Refresh as RefreshIcon } from 'material-ui-icons';
import { AppState } from '../../interfaces';
import * as select from '../../redux/selectors';

interface StateProps {
  loading: boolean;
}
const mapStateToProps = (state: AppState) => ({
  loading: select.isLoading(state),
});

interface DispatchProps {
  getEntries(): Action;
  getUsers(): Action;
  getSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
  getUsers: () => dispatch(getUsersRequest()),
  getSlots: () => dispatch(getSlotsRequest()),
});

const renderPaths: string[] = ['/entries', '/users', '/slots'];

const shouldRender = (path: string) => renderPaths.indexOf(path) !== -1;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

const RefreshButton: React.SFC<Props> = props =>
  props.loading ? (
    <CircularProgress style={{ color: 'white' }} />
  ) : shouldRender(props.location.pathname) ? (
    <IconButton
      onClick={() => {
        const { location } = props;
        switch (location.pathname) {
          case '/entries':
            props.getEntries();
            break;
          case '/users':
            props.getUsers();
            break;
          case '/slots':
            props.getSlots();
            break;
          default:
            break;
        }
      }}
      style={{ color: 'white' }}
    >
      <RefreshIcon />
    </IconButton>
  ) : null;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RefreshButton));
