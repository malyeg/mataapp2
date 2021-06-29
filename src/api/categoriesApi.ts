import {Entity} from '../types/DataTypes';
import categories from './categories.json';

export interface Category extends Entity {
  id: string;
  name: string;
  group?: string;
  parent?: string;
  level?: number;
}
class CategoriesApi {
  getAll = () => {
    return categories;
  };

  getById = (id: string) => {
    return categories.find(category => category.id === id);
  };
}

const categoriesApi = new CategoriesApi();

export default categoriesApi;
