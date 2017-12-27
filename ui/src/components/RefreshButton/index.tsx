import * as React from 'react';
import { Button } from 'material-ui';
import { Dispatch, connect } from 'react-redux';
import { Action } from 'redux';
import { getEntriesRequest, getUsersRequest } from '../../redux/actions';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props {
  getEntries(): Action;
  getUsers(): Action;
}

// TODO: Implement, only render when wanted
const shouldRender = (path: string) => true;

const RefreshButton: React.SFC<Props & RouteComponentProps<{}>> = (props) => (
  shouldRender(props.match.url) ?
  (
    <Button
      onClick={() => {
        const { location } = props;
        switch (location.pathname) {
          case('/entries'):
            props.getEntries();
            break;
            case('/users'):
            props.getUsers();
            break;
          default:
            break;
        }
      }}
      raised={true}
    >
      Refresh
    </Button>
  ) : null
);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
  getUsers: () => dispatch(getUsersRequest()),
});

export default withRouter(connect(undefined, mapDispatchToProps)(RefreshButton));
