import {QueryBuilder} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface City {
  id: string;
  name: string;
  stateId: string;
}
class CitiesApi extends DataApi<City> {
  constructor() {
    super('cities');
  }

  getByStateId = async (stateId: string) => {
    const query = new QueryBuilder<City>()
      .filter('stateId', Number(stateId))
      .build();
    const cities = await this.getAll(query);
    if (cities) {
      cities.items = cities.items.map(c => ({
        id: c.id.toString(),
        name: c.name,
        stateId: c.stateId.toString(),
      }));
    }
    return cities;
  };
}

const citiesApi = new CitiesApi();

export default citiesApi;
