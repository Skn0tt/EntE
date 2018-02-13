import * as React from 'react';
import { LinearProgress, withStyles } from 'material-ui';

import styles from './styles';
import { WithStyles } from 'material-ui/styles/withStyles';

interface Props {}

const LoadingIndicator: React.SFC<Props & WithStyles<string>> = props => (
  <LinearProgress
    className={props.classes.loading}
    variant="query"
  />
);

export default withStyles(styles)(LoadingIndicator);
