import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { Slot } from '../../interfaces/index';
import { AppState } from '../../redux/reducer';
import { Action } from 'redux';
import { List } from 'immutable';

interface Props extends WithStyles {
  slots: List<Slot>;
}

const Slots: React.SFC<Props> = (props) => (
  <div>
    Entries
  </div>
);

const mapStateToProps = (state: AppState) => ({
  slots: select.getSlots(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Slots));
