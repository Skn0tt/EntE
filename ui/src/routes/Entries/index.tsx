import * as React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry } from '../../interfaces/index';
import { AppState } from '../../redux/reducer';
import { Action } from 'redux';
import { List } from 'immutable';

interface Props {
  entries: List<Entry>;
}

const Entries: React.SFC<Props> = (props) => (
  <div>
    Entries
  </div>
);

const mapStateToProps = (state: AppState) => ({
  entries: select.getEntries(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entries));
