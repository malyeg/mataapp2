import {Entity, Nestable} from '../../../types/DataTypes';

export type PickerState = {
  items: Entity[];
  listItems: Entity[];
  selectedItem?: Entity;
  defaultItem?: Entity;
  isModalVisible?: boolean;
  searchValue?: string;
  path: Entity[];
  multiLevel?: boolean;
};

interface LoadItemsAction {
  type: 'LOAD_ITEMS';
  items: Entity[];
  defaultValue?: string;
}
interface BackAction {
  type: 'BACK';
}

interface SelectItemAction {
  type: 'SELECT_ITEM';
  item: Entity;
  closeModal: boolean;
}

interface SearchItemsAction {
  type: 'SEARCH_ITEMS';
  search: string;
}
interface ResetItemsAction {
  type: 'RESET_ITEMS';
  items: Entity[];
}

interface OpenModalAction {
  type: 'OPEN_MODAL';
}
interface CloseModalAction {
  type: 'CLOSE_MODAL';
}
interface SetModalAction {
  type: 'SET_MODAL';
  isModalVisible: boolean;
}

type PickerAction<T extends Entity> =
  | LoadItemsAction
  | BackAction
  | SelectItemAction
  | SearchItemsAction
  | ResetItemsAction;

const getRootItems = (items: Nestable[]) => {
  return items.filter(i => i.level === 0);
};

const onLoadItems = (state: PickerState, action: LoadItemsAction) => {
  state.defaultItem = undefined;
  state.selectedItem = undefined;
  state.items = action.items;

  state.listItems = state.multiLevel
    ? getRootItems(action.items)
    : [...action.items];

  if (action.defaultValue) {
    const foundItem = state.items.find(item => {
      return item.id.toString() === action.defaultValue?.toString();
    });
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!foundItem) {
      state.selectedItem = foundItem;
      state.defaultItem = foundItem;
      // state.field?.onChange(defaultItem.value);
    }
  }
  return state;
};

const onBack = (state: PickerState) => {
  if (!state.multiLevel) {
    return state;
  }
  if (state.path.length > 1) {
    state.path.pop();
    const lastItem = state.path[state.path.length - 1];
    if (lastItem) {
      state.listItems = state.items.filter(i => i.parent === lastItem.id);
    }
  } else if (state.path.length === 1) {
    state.path = [];
    state.listItems = getRootItems(state.items);
  }
  return state;
};

const onSearch = (state: PickerState, action: SearchItemsAction) => {
  const searchValue = action.search;

  if (searchValue === state.searchValue) {
    return state;
  }
  const pathItem = state.path[state.path.length - 1];
  let filteredItems;
  if (!!searchValue && searchValue.trim() !== '') {
    filteredItems = state.items.filter(item => {
      if (!state.multiLevel) {
        return item.name?.toLowerCase().includes(searchValue.toLowerCase());
      } else if (pathItem) {
        return (
          pathItem.id === item.parent &&
          item.name?.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else {
        return (
          item.level === 0 &&
          item.name?.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
    });
  } else {
    if (state.multiLevel) {
      filteredItems = state.items.filter(item => {
        return pathItem ? pathItem.id === item.parent : item.level === 0;
      });
    } else {
      filteredItems = state.items;
    }
  }
  state.listItems = filteredItems;
  state.searchValue = searchValue;

  return state;
};

const onSelectItem = (state: PickerState, action: SelectItemAction) => {
  state.selectedItem = action.item;
  const selectedItem = action.item as unknown as Nestable;
  if (state.multiLevel && selectedItem.level !== -1) {
    const childs = state.items.filter(
      i => (i as unknown as Nestable).parent === action.item.id,
    );
    if (childs) {
      state.listItems = childs;
      state.path.push(action.item);
    }
  } else {
    state.isModalVisible = action.closeModal ? !action.closeModal : false;
  }

  return state;
};

function pickerReducer<T extends Entity>(
  state: PickerState,
  action: PickerAction<T>,
) {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return onLoadItems(state, action);
    case 'BACK':
      return onBack(state);
    case 'SEARCH_ITEMS':
      return onSearch(state, action);
    case 'SELECT_ITEM':
      return onSelectItem(state, action);
    case 'RESET_ITEMS':
      state.listItems = [...action.items];
      return state;
    default:
      return state;
  }
}

export default pickerReducer;
