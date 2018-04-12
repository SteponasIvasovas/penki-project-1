import {select, remove, insert, update, foreign2, FORMAT} from '../scripts/data';

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
export const ENABLE_CREATE_UI = 'ENABLE_CREATE_UI';
export const DISABLE_CREATE_UI = 'DISABLE_CREATE_UI';
export const ENABLE_EDIT_UI = 'ENABLE_EDIT_UI';
export const DISABLE_EDIT_UI = 'DISABLE_EDIT_UI';
export const REQUIRE_SELECTS_DATA = 'REQUIRE_SELECTS_DATA';
export const SET_FILTER_TEXT = 'SET_FILTER_TEXT';

export const selectCategory = (category) => ({
  type: SELECT_CATEGORY,
  category
});
export const enableCreateUI = {type: ENABLE_CREATE_UI};
export const disableCreateUI = {type: DISABLE_CREATE_UI};
export const enableEditUI = (category, id) => {
  return {
    type: ENABLE_EDIT_UI,
    category,
    id
  }
};
export const disableEditUI = (category, id) => {
  return {
    type: DISABLE_EDIT_UI,
    category,
    id
  }
}
const requestSelectsData = (category) => ({
  type: REQUEST_SELECTS_DATA,
  category
});
const receiveSelectsData = (category, selectsData) => ({
  type: RECEIVE_SELECTS_DATA,
  category,
  selectsData,
  receivedAt: Date.now()
});
export const selectPage = (category, page) => ({
  type: SELECT_PAGE,
  category,
  page
});
export const setFilterText = (filterText) => ({
  type: SET_FILTER_TEXT,
  filterText
})
const requestItems = (category) => ({
  type: REQUEST_ITEMS,
  category
});
const receiveItems = (category, items, pages, page) => ({
  type: RECEIVE_ITEMS,
  category,
  items,
  pages,
  page,
  receivedAt: Date.now()
});
const insertItemRequest = (category) => ({
  type: ITEM_INSERT_REQUEST,
  category
});
const insertItemSuccess = (category) => ({
  type: ITEM_INSERT_SUCCESS,
  category
});
const updateItemRequest = (category) => ({
  type: ITEM_UPDATE_REQUEST,
  category
});
const updateItemSuccess = (category, id, item) => ({
  type: ITEM_UPDATE_SUCCESS,
  category,
  item,
  id
});
const deleteItemRequest = (category) => ({
  type: ITEM_DELETE_REQUEST,
  category
});
const deleteItemSuccess = (category) => ({
  type: ITEM_DELETE_SUCCESS,
  category
});
const requireSelectsData = (category) => ({
  type: REQUIRE_SELECTS_DATA,
  category,
});

const partialFetch = (category, page, perPage) => {
  return (dispatch, getState) => {

  }
}


export const fetchItems = (category, page, perPage) => {
  return (dispatch, getState) => {
    dispatch(requestItems(category, page, perPage));
    return select(category).then(data => {
      // console.log(data);
      // var g = JSON.stringify(data).replace(/[\[\]\,\"]/g,'');
      // console.log(g.length);

      const {filterText} = getState();
      data = data.filter(item => item.name.includes(filterText));
      const pages = Math.ceil(data.length / perPage);
      //from delete && insert
      if (page > pages) page = pages;
      const filtered = data.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
      return dispatch(receiveItems(category, filtered, pages, page));
    });
  }
};
export const fetchSelectsData = (category) => {
  return (dispatch) => {
    dispatch(requestSelectsData(category));

    const fKeys = foreign2(category);
    const promises = [];
    fKeys.forEach(fKey => {
      promises.push(select(fKey.category).then(data => {
        return {[fKey.category] : data};
      }));
    });

    return Promise.all(promises).then(data => {
      if (promises.length !== 0)
        data = data.reduce((a, b) => ({...a, ...b}));

      return dispatch(receiveSelectsData(category, data));
    });
  }
}
export const fetchSelectsDataIfNeeded = (category) => {
  return (dispatch, getState) => {
    const currentCategory = getState().itemsByCategory[category];

    if (!currentCategory || (currentCategory && currentCategory.needSelectsData)) {
      return dispatch(fetchSelectsData(category));
    }
  }
}
export const deleteItem = (category, id) => {
  return (dispatch) => {
    dispatch(deleteItemRequest(category));
    return remove(category, id).then(() => {
      return dispatch(deleteItemSuccess(category));
    });
  }
};
export const deleteAndFetch = (category, id) => {
  return (dispatch, getState) => {
    return dispatch(deleteItem(category, id)).then(() => {
      const {perPage} = getState();
      const {page} = getState().itemsByCategory[category];
      return dispatch(fetchItems(category, page, perPage));
    });
  }
}
export const insertItem = (category, item) => {
  return (dispatch) => {
    dispatch(insertItemRequest(category));
    return insert(category, item).then(() => {
      return dispatch(insertItemSuccess(category));
    });
  }
};
export const insertAndFetch = (category, item) => {
  return (dispatch, getState) => {
    return dispatch(insertItem(category, item)).then(() => {
      const {filteredText, perPage} = getState();
      const page = filteredText ? 1 : Infinity;
      return dispatch(fetchItems(category, page, perPage));
    });
  }
}
export const updateItem = (category, id, item) => {
  return (dispatch) => {
    dispatch(updateItemRequest(category));
    return update(category, id, item).then(() => {
      return dispatch(updateItemSuccess(category, id, item));
    });
  }
};
export const requireSelectsDataForAll = (updatedCategory) => {
  return (dispatch, getState) => {
    const available = Object.keys(getState().itemsByCategory);

    available.forEach(category => {
      if (FORMAT[category].includes(`${updatedCategory}_id`))
       dispatch(requireSelectsData(category))
    });
  }
}
export const setTextAndFetch = (text) => {
  return (dispatch, getState) => {
    const {perPage, selectedCategory} = getState();
    console.log(perPage, selectedCategory);
    dispatch(selectPage(selectedCategory, 1));
    dispatch(setFilterText(text));
    return dispatch(fetchItems(selectedCategory, 1, perPage));
  }
}
