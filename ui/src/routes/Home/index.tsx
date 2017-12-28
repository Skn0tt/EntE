import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import styles from './styles';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid } from 'material-ui';
import Button from 'material-ui/Button/Button';
import { Link } from 'react-router-dom';

interface Props extends WithStyles, RouteComponentProps<{}> {}

const Home: React.SFC<Props> = (props) => (
  <Grid
    container={true}
    justify="center"
    alignItems="center"
  >
    <Grid
      item={true}
    >
      <Button
        component={p => <Link to="/newEntry" {...p} />}
        raised={true}
      >
        Neuer Eintrag
      </Button>
    </Grid>
    <Grid
      item={true}
    >
      <Button
        component={p => <Link to="/entries" {...p} />}
        raised={true}
      >
        Meine Einträge
      </Button>
    </Grid>
  </Grid>
);

export default withRouter(withStyles(styles)(Home));
