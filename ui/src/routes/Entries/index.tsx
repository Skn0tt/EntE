import * as React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'react-redux';

import styles from './styles';

import * as select from '../../redux/selectors';
import { Entry } from '../../interfaces/index';

interface Props {
  entries: [Entry];
}

const Entries: React.SFC<Props> = () => (
  <div>
    Entries
  </div>
);

const mapStateToProps = (state: any) => ({
  entries: select.getEntries(state),
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Entries));
