import * as React from 'react';
import styles from './styles';
import { withStyles, CircularProgress, WithStyles, Grid } from 'material-ui';

interface OwnProps {}

type Props = OwnProps & WithStyles;

const LoadingIndicator: React.SFC<Props> = props => (
  <Grid container alignItems="center" justify="center" className={props.classes.container}>
    <Grid item>
      <CircularProgress />
    </Grid>
  </Grid>
);

export default withStyles(styles)(LoadingIndicator);
