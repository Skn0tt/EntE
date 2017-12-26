import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, MongoId, Entry } from '../../interfaces/index';
import { Action } from 'redux';

import { withRouter, RouteComponentProps } from 'react-router';
import Modal from '../../components/Modal';

interface RouteMatch {
  entryId: MongoId;
}

interface Props extends WithStyles, RouteComponentProps<RouteMatch> {
  getEntry(id: MongoId): Entry;
}

const SpecificEntry: React.SFC<Props> = (props) => (
  <Modal
    onClose={() => props.history.goBack()}
  >
    <div>
      TEst!!
    </div>
  </Modal>
);

const mapStateToProps = (state: AppState) => ({
  getEntry: (id: MongoId) => select.getEntry(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SpecificEntry)));
