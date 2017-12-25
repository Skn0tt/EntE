import * as React from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui';
import { AppState } from '../../interfaces/index';
import * as select from '../../redux/selectors';

interface Props {
  loading: boolean;
}

const LoadingIndicator: React.SFC<Props> = (props) => (
  props.loading ?
    <LinearProgress mode="query" />
  : null
);

const mapStateToProps = (state: AppState) => ({
  loading: select.isLoading(state),
});

export default connect(mapStateToProps)(LoadingIndicator);
