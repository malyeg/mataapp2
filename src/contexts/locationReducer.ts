import {Location} from '../types/DataTypes';

// export const initialState: LocationInitState = {
//   connected: false,
// };

export type LocationState = {
  connected: boolean;
  location?: Location;
};

interface SetLocationAction {
  type: 'SET_LOCATION';
  location: Location;
}
interface SetConnectionAction {
  type: 'SET_CONNECTION';
  connected: boolean;
}

export type LocationActions = SetLocationAction | SetConnectionAction;

function locationReducer(draftState: LocationState, action: LocationActions) {
  switch (action.type) {
    case 'SET_CONNECTION':
      draftState.connected = action.connected;
      return draftState;
    case 'SET_LOCATION':
      draftState.location = action.location;
      draftState.connected = true;
      return draftState;
    default:
      return draftState;
  }
}

export default locationReducer;
