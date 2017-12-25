import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { List } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry, AppState } from '../../interfaces/index';
import { Action } from 'redux';
import UpperRight from '../../elements/UpperRight';

import ListItem from '../../components/ListItem';
import { getEntriesRequest } from '../../redux/actions';

interface Props extends WithStyles {
  entries: Entry[];
  getEntries(): Action;
}

const Entries: React.SFC<Props> = (props) => (
  <React.Fragment>
    <List>
      {props.entries.map(entry => (
        <ListItem id={entry.get('_id') || ''}/>
      ))}
    </List>
    <UpperRight>
      <div>Test!</div>
    </UpperRight>
  </React.Fragment>
);

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entries));
