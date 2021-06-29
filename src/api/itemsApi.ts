import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import constants from '../config/constants';
import {DataSearchable, Entity, Location} from '../types/DataTypes';
import {DataApi} from './DataApi';

import Config from 'react-native-config';
import {Category} from './categoriesApi';
import {APIOptions} from './Api';

export type ItemStatus = 'draft' | 'online' | 'pending';
export type ConditionType = 'new' | 'goodAsNew' | 'used' | 'usedWithIssues';
export type SwapType = 'free' | 'swapWithAnother' | 'swapWithAny';

export type ImageSource = {
  uri?: string;
  name?: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  isTemplate?: boolean;
  downloadURL?: string;
};
export interface Item extends DataSearchable, Entity {
  id: string;
  userId: string;
  name: string;
  category: Category;
  // status: {type: string; desc?: string};
  condition: {
    type: ConditionType;
    desc?: string;
  };
  description?: string;
  images?: ImageSource[];
  defaultImageURL?: string;
  location?: Location;
  views?: number;
  timestamp?: Date;
  status: ItemStatus;
  swapOption: {
    type: SwapType;
    category?: string;
  };
}
class ItemsApi extends DataApi<Item> {
  constructor() {
    super(
      firestore().collection<Item>(Config.SCHEMA_PREFIX + 'items'),
      'items',
    );
  }

  uploadBatch = async (itemId: string, images: ImageSource[]) => {
    this.logger.debug('uploadBatch', images);
    const promises: any[] = [];
    images.forEach(async image => {
      const promise = this.upload(itemId, image);
      promises.push(promise);
    });
    await Promise.all(promises);
  };

  deleteImage = async (uid: string, image: ImageSource) => {
    const reference = storage().ref(
      `${constants.firebase.ITEM_UPLOAD_PATH}/${uid}/${image.name}`,
    );
    await reference.delete();
  };

  upload = (uid: string, image: ImageSource) => {
    const reference = storage().ref(
      `${constants.firebase.ITEM_UPLOAD_PATH}/${uid}/${image.name}`,
    );
    const pathToFile = image.uri!;
    // uploads file
    const task = reference.putFile(pathToFile);
    return task;
  };

  delete = async (doc: Item, options?: APIOptions) => {
    await this.deleteById(doc.id, options);
    try {
      doc.images?.forEach(image => {
        this.deleteImage(doc.userId, image);
        console.log('deleting image', image.name);
      });
    } catch (error) {
      console.error(error);
      //TODO report error
    }
  };

  readonly MY_ITEMS_CACHE_KEY = 'my_items';
}

const itemsApi = new ItemsApi();

export default itemsApi;
