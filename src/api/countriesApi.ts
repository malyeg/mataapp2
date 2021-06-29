import {Query} from '../types/DataTypes';
import countryCodes from './countryCodes.json';
import countries from '../data/countries.json';
import states from '../data/states.json';

export interface Country {
  id: string;
  name: string;
  code: string;
  phoneCode: string;
  iso2: string;
  iso3: string;
  emoji: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
}
class CountriesApi {
  getAll = (query?: Query<Country>) => {
    if (query) {
      if (query.filters) {
        const filter = query.filters[0];
        return countryCodes.filter(country => {
          return country[filter.field]
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        });
      }
    }
    return countryCodes as Country[];
  };

  getCountries = () => {
    return countries as unknown as Country[];
  };
  getStates = (countryId: string) => {
    let filteredStates = states.filter(
      state => state.country_id.toString() === countryId.toString(),
    );

    return filteredStates.map(
      state =>
        ({
          id: state.id,
          name: state.name,
        } as unknown as State),
    );
  };
}

const countriesApi = new CountriesApi();

export default countriesApi;
