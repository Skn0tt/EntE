import * as React from 'react';
import { Button } from 'material-ui';
import { Dispatch, connect } from 'react-redux';
import { Action } from 'redux';
import { getEntriesRequest } from '../../redux/actions';

interface Props {
  getEntries(): Action;
}

const RefreshButton = (props: Props) => (
  <Button
    onClick={() => props.getEntries()}
    raised={true}
  >
    Refresh
  </Button>
);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
});

export default connect(undefined, mapDispatchToProps)(RefreshButton);
