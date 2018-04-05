import {select, remove, insert, update, foreign2} from '../scripts/data.js';

export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_PAGE = 'SELECT_PAGE';
export const REQUEST_ITEMS = 'REQUEST_ITEMS';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const REQUEST_SELECTS_DATA = 'REQUEST_SELECTS_DATA';
export const RECEIVE_SELECTS_DATA = 'RECEIVE_SELECTS_DATA';
export const ITEM_INSERT_REQUEST = 'ITEM_INSERT_REQUEST';
export const ITEM_INSERT_SUCCESS = 'ITEM_INSERT_SUCCESS';
export const ITEM_UPDATE_REQUEST = 'ITEM_UPDATE_REQUEST';
export const ITEM_UPDATE_SUCCESS = 'ITEM_UPDATE_SUCCESS';
export const ITEM_DELETE_REQUEST = 'ITEM_DELETE_REQUEST';
export const ITEM_DELETE_SUCCESS = 'ITEM_DELETE_SUCCESS';

export const selectCategory = (category) => ({
  type: 'SELECT_CATEGORY',
  category
});

const requestSelectsData = (category) => ({
  type: 'REQUEST_SELECTS_DATA',
  category
});

const receiveSelectsData = (category, selectsData) => ({
  type: 'RECEIVE_SELECTS_DATA',
  category,
  selectsData,
  receivedAt: Date.now()
});

export const selectPage = (page) => ({
  type: 'SELECT_PAGE',
  category,
  page
});

const requestItems = (category) => ({
  type: 'REQUEST_ITEMS',
  category
});

const receiveItems = (category, items, pages, page) => ({
  type: 'RECEIVE_ITEMS',
  category,
  items,
  pages,
  page,
  receivedAt: Date.now()
});

export const selectPage = (page) => ({
  type: 'SELECT_PAGE',
  page
});

const insertItemRequest = {type: 'ITEM_INSERT_REQUEST'};

const insertItemSuccess = {type: 'ITEM_INSERT_SUCCESS'};

const updateItemRequest = {type: 'ITEM_UPDATE_REQUEST'};

const updateItemSuccess = (category, id, item) => ({
  type: 'ITEM_UPDATE_SUCCESS'
  category,
  item,
  id
});

const deleteItemRequest = {type: 'ITEM_DELETE_REQUEST'};

const deleteItemSuccess = {type: 'ITEM_DELETE_SUCCESS'};

export const fetchItems = (category, page, perPage) => {
  return dispatch => {
    dispatch(requestItems(category, page, perPage));

    return select([category]).then(data => {
      const pages = data.length;
      const filtered = data.slice(page * perPage, page * perPage + perPage);
      return dispatch(receiveItems(category, filtered, pages, page));
    });
  }
};

export const fetchSelectsData = (category) => {
  return dispatch => {
    dispatch(requestSelectsData(category));

    const fKeys = foreign2(selected);
    const promises = [];
    fKeys.forEach(fKey => {
      promises.push(select([fKey.category]).then(data =>
        data = data.map(item => ({
          id: item.id,
          name: item.name,
        }));
        return {[fKey.key] : data};
      }));
    });

    return Promise.all(promises).then(data => {
      if (promises.length !== 0)
        data = data.reduce((a, b) => ({...a, ...b}));

      return dispatch(receiveSelectsData(category, data));
    });
  }
}

export const deleteItem = (category, id) => {
  return (dispatch) => {
    dispatch(deleteItemRequest);
    return remove(category, id).then(() => {
      return dispatch(deleteItemSuccess);
    });
  }
};

export const deleteAndFetch = (category, id) => {
  return (dispatch, getState) => {
    return dispatch(deleteItem).then(() => {
      const { page, perPage } = getState();
      return dispatch(fetchItems(category, page, perPage));
    });
  }
}

export const insertItem = (category, item) => {
  return (dispatch, getState) => {
    dispatch(insertItemRequest);
    return insert(category, item).then(() => {
      return dispatch(insertItemSuccess);
    });
  }
};

export const insertAndFetch = (category, item) => {
  return (dispatch, getState) => {
    return dispatch(insertItem(category, item)).then(() => {
      const { page, perPage, totalPages } = getState();

      if (page === totalPages) {
        return dispatch(fetchItems(category, page, perPage));
      } else {
        return Promise.resolve();
      }
    });
  }
}

export const updateItem = (category, id, item) => {
  return (dispatch, getState) => {
    dispatch(updateItemRequest);
    return update(category, id, item).then(() => {
      return dispatch(updateItemSuccess(category, id, item));
    });
  }
};
