import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { User } from '../../interfaces/index';
import { AppState } from '../../redux/reducer';
import { Action } from 'redux';
import { StyledComponentProps } from 'material-ui';
import { List } from 'immutable';

interface Props {
  users: List<User>;
}

const Users: React.SFC<Props & StyledComponentProps<string> & WithStyles<string>> = (props) => (
  <div>
    Entries
  </div>
);

const mapStateToProps = (state: AppState) => ({
  users: select.getUsers(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users));
