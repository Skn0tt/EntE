import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { User, AppState } from '../../interfaces/index';
import { Action } from 'redux';
import { StyledComponentProps, List } from 'material-ui';
import ListItem from '../../components/ListItem';

interface Props {
  users: User[];
}

const Users: React.SFC<Props & StyledComponentProps<string> & WithStyles<string>> = (props) => (
  <List>
    {props.users.map(user => (
      <ListItem id={user.get('_id') || ''}/>
    ))}
  </List>
);

const mapStateToProps = (state: AppState) => ({
  users: select.getUsers(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users));
