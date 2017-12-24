import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import { List } from 'material-ui';
import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry } from '../../interfaces/index';
import { AppState } from '../../redux/reducer';
import { Action } from 'redux';

import ListItem from '../../components/ListItem';
import { getEntriesRequest } from '../../redux/actions';

interface Props extends WithStyles {
  entries: Entry[];
  getEntries(): Action;
}

const Entries: React.SFC<Props> = (props) => (
  <List>
    {props.entries.map(entry => (
      <ListItem id={entry.get('_id') || ''}/>
    ))}
  </List>
);

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  getEntries: () => dispatch(getEntriesRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entries));
