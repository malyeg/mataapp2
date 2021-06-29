import {useContext} from 'react';
import {LocationContext} from '../contexts/LocationContext';

const useLocation = () => {
  const context = useContext(LocationContext);

  return context;
};

export default useLocation;
