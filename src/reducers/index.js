import { combineReducers } from 'redux';
import {
  SELECT_PAGE,
  REQUEST_ITEMS,
  RECEIVE_ITEMS,
  REQUEST_SELECTS_DATA,
  RECEIVE_SELECTS_DATA,
  ITEM_DELETE_REQUEST,
  ITEM_DELETE_SUCCESS,
  ITEM_INSERT_REQUEST,
  ITEM_INSERT_SUCCESS,
  ITEM_UPDATE_REQUEST,
  ITEM_UPDATE_SUCCESS
} from './actions';

function selectedCategory(state, action) {
  switch(action.type) {
    case SELECT_CATEGORY:
      return action.category;
    default:
      return state;
  }
}

function items(state, action) {
  switch(action.type) {
    case SELECT_PAGE :
      return {...state, page: action.page};
    case REQUEST_ITEMS:
      return {...state, isFetching: true};
    case RECEIVE_ITEMS:
      return {...state,
        isFetching: false,
        items: action.items,
        page: action.page,
        pages: action.pages
        lastUpdate: action.receivedAt,
      };
    case REQUEST_SELECTS_DATA:
      return {...state, isFechingSelectsData: true};
    case RECEIVE_SELECTS_DATA:
      return {...state,
        isFechingSelectsData: false,
        selectsData: action.selectsData
      }
    case ITEM_DELETE_REQUEST:
      return {...state, isDeleting: true};
    case ITEM_DELETE_SUCCESS:
      return {...state, isDeleting: false};
    case ITEM_INSERT_REQUEST:
      return {...state, isInserting: true};
    case ITEM_INSERT_SUCCESS:
      return {...state, isInserting: false};
    case ITEM_UPDATE_REQUEST:
      return {...state, isUpdating: true};
    case ITEM_UPDATE_SUCCESS:
      return {...state,
        isUpdating: false,
        items: state.items.map(item => {
          if (item.id === action.id) {
            return {...item, action.item};
          }
          return item;
        })
      }
    default:
      return state;
  }
}

function itemsByCategory(state = {}, action) {
  switch(action.type) {
    case SELECT_PAGE:
    case REQUEST_ITEMS:
    case RECEIVE_ITEMS:
    case REQUEST_SELECTS_DATA:
    case RECEIVE_SELECTS_DATA:
    case ITEM_DELETE_REQUEST:
    case ITEM_DELETE_SUCCESS:
    case ITEM_INSERT_REQUEST:
    case ITEM_INSERT_SUCCESS:
    case ITEM_UPDATE_REQUEST:
    case ITEM_UPDATE_SUCCESS:
      return {...state, [action.category] : items(state[action.category], action)}
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectedCategory,
  itemsByCategory
});

export default rootReducer;
