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
        ids: action.items.map(item => item.id),
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
      return {...state, ids: state.ids.filter(id => id !== action.id), isDeleting: false};
    case ITEM_INSERT_REQUEST:
      return {...state, isInserting: true};
    case ITEM_INSERT_SUCCESS:
      return {...state, isInserting: false};
    case ITEM_UPDATE_REQUEST:
      return {...state, isUpdating: true};
    case ITEM_UPDATE_SUCCESS:
      return {...state, isUpdating: false};
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

function createUI(state = false, action) {
  switch(action.type) {
    case ENABLE_CREATE_UI:
      return true;
    case DISABLE_CREATE_UI:
      return false;
    default:
      return state;
  }
}

function entities(state = {}, action) {
  switch(action.type) {
    case RECEIVE_ITEMS:
    case ITEM_UPDATE_SUCCESS:
    case ENABLE_EDIT_UI:
    case DISABLE_EDIT_UI:
      return {...state, [action.category] : entityItemsByCategory(state[action.category], action)}
    default:
      return state;
  }
}

function entityItemsByCategory(state = {}, action) {
  switch(action.type) {
    case RECEIVE_ITEMS:
      let newState = {};
      action.items.forEach(item => {
        if (!state[item.id]) {
          newState[item.id] = {...item, editUI: false};
        } else {
          newState[item.id] = {...state[item.id], ...item};
        }
      });

      return {...state, ...newState};
    case ITEM_UPDATE_SUCCESS:
      return {...state, [action.id] : {...state[action.id], ...action.item, editUI: false}};
    case ITEM_DELETE_SUCCESS:
      newState = {...state}
      delete newState[action.id];
      return newState;
    case ENABLE_EDIT_UI:
      return {...state, [action.id] : {...state[action.id], editUI: true}};
    case DISABLE_EDIT_UI:
      return {...state, [action.id] : {...state[action.id], editUI: false}};
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectedCategory,
  itemsByCategory,
  createUI,
  entities,
});

export default rootReducer;
