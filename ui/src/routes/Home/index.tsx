import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import styles from './styles';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid } from 'material-ui';
import Button from 'material-ui/Button/Button';
import { Link } from 'react-router-dom';

interface Props extends WithStyles, RouteComponentProps<{}> {}

const Home: React.SFC<Props> = props => (
  <Grid
    container
    justify="center"
    alignItems="center"
  >
    <Grid
      item
    >
      <Button
        component={p => <Link to="/createEntry" {...p} />}
        variant="raised"
      >
        Neuer Eintrag
      </Button>
    </Grid>
    <Grid
      item
    >
      <Button
        component={p => <Link to="/entries" {...p} />}
        variant="raised"
      >
        Meine Einträge
      </Button>
    </Grid>
    <Grid
      item
    >
      <Button
        component={p => <Link to="/createUser" {...p} />}
        variant="raised"
      >
        Neuer Nutzer
      </Button>
    </Grid>
  </Grid>
);

export default withRouter(withStyles(styles)(Home));
