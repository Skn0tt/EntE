import * as React from 'react';

import styles from './styles';
import { WithStyles } from 'material-ui/styles/withStyles';
import { withStyles, IconButton, List } from 'material-ui';
import { connect, Dispatch } from 'react-redux';
import * as select from '../../redux/selectors';
import { AppState } from '../../interfaces/index';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import { PowerSettingsNew as PowerSettingsNewIcon } from 'material-ui-icons';
import { Action } from 'redux-actions';
import { logout } from '../../redux/actions';
import ListItemIcon from 'material-ui/List/ListItemIcon';

interface StateProps {
  displayname: string;
}
const mapStateToProps = (state: AppState) => ({
  displayname: select.getDisplayname(state),
});

interface DispatchProps {
  logout(): Action<void>;
}
const mapDispatchToProps = (dispatch: Dispatch<Action<void>>) => ({
  logout: () => dispatch(logout()),
});

type Props = StateProps & DispatchProps & WithStyles;

const LoginStatus: React.SFC<Props> = props => (
  <div className={props.classes.container}>
    <List>
      <ListItem>
        <ListItemIcon>
          <IconButton aria-label="logout" onClick={() => props.logout()}>
            <PowerSettingsNewIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={props.displayname} />
      </ListItem>
    </List>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginStatus));
