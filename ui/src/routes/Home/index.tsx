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
      <Link to="/newEntry">
        <Button
          raised={true}
        >
          Neuer Eintrag
        </Button>
      </Link>
    </Grid>
    <Grid
      item={true}
    >
      <Link to="/entries">
        <Button
          raised={true}
        >
          Meine Einträge
        </Button>
      </Link>
    </Grid>
    <Grid
      item={true}
    >
      <Link to="">
        <Button
          raised={true}
        >
          3
        </Button>
      </Link>
    </Grid>
    
  </Grid>
);

export default withRouter(withStyles(styles)(Home));
