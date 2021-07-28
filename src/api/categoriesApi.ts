import {Entity} from '../types/DataTypes';
import categories from '../data/categories';

export interface Category extends Entity {
  id: string;
  name: string;
  group?: string;
  parent?: string;
  level?: number;
  style?: {
    iconName?: string;
    bgColor?: string;
    textColor?: string;
  };
}
class CategoriesApi {
  getAll = () => {
    return categories as Category[];
  };

  getById = (id: string) => {
    return categories.find(category => category.id === id);
  };
}

const categoriesApi = new CategoriesApi();

export default categoriesApi;
