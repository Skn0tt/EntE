import * as React from 'react';
import {
  Modal as MUIModal, withStyles,
} from 'material-ui';
import { WithStyles } from 'material-ui/styles/withStyles';
import styles from './styles';

interface Props {
  onClose(): void;
}

const Modal: React.SFC<Props & WithStyles<string>> = props => (
  <MUIModal
    show={true}
    onClose={() => props.onClose()}
    className={props.classes.modal}
  >
    {props.children}
  </MUIModal>
);

export default withStyles(styles)(Modal);
