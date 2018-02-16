import * as React from 'react';
import { Button } from 'material-ui';
import { Dispatch, connect } from 'react-redux';
import { Action } from 'redux';
import { getEntriesRequest, getUsersRequest, getSlotsRequest } from '../../redux/actions';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props {
  getEntries(): Action;
  getUsers(): Action;
  getSlots(): Action;
}

const renderPaths: string[] = ['/entries', '/users', '/slots'];

const shouldRender = (path: string) => renderPaths.indexOf(path) !== -1;

const RefreshButton: React.SFC<Props & RouteComponentProps<{}>> = props =>
  shouldRender(props.location.pathname) ? (
    <Button
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
      variant="raised"
    >
      Aktualisieren
    </Button>
  ) : null;

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
  getUsers: () => dispatch(getUsersRequest()),
  getSlots: () => dispatch(getSlotsRequest()),
});

export default withRouter(connect(undefined, mapDispatchToProps)(RefreshButton));
