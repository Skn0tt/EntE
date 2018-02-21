import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import * as select from '../../redux/selectors';
import { AppState, Slot, MongoId, User } from '../../interfaces/index';
import SignedAvatar from '../SpecificEntry/elements/SignedAvatar';
import UnsignedAvatar from '../SpecificEntry/elements/UnsignedAvatar';
import { getSlotsRequest } from '../../redux/actions';
import { Action } from 'redux';
import Table from '../../components/Table';

interface StateProps {
  slots: Slot[];
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  slots: select.getSlots(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

interface DispatchProps {
  requestSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestSlots: () => dispatch(getSlotsRequest()),
});

type Props = StateProps & DispatchProps;

const Slots = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<Props> {
    componentDidMount() {
      this.props.requestSlots();
    }

    render() {
      const { getUser, slots } = this.props;

      return (
        <Table
          headers={['Name', 'Datum', 'Von', 'Bis', 'Signiert', 'Lehrer']}
          items={slots}
          keyExtractor={(slot: Slot) => slot.get('_id')}
          trueElement={<SignedAvatar />}
          falseElement={<UnsignedAvatar />}
          cellExtractor={(slot: Slot) => [
            getUser(slot.get('student')).get('displayname'),
            slot.get('date').toLocaleDateString(),
            slot.get('hour_from'),
            slot.get('hour_to'),
            slot.get('signed'),
            getUser(slot.get('teacher')).get('displayname'),
          ]}
        />
      );
    }
  },
);

export default Slots;
