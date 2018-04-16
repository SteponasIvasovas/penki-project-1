import {select, remove, insert, update, foreign2, SCHEMA} from '../scripts/data';
import {
  SELECT_CATEGORY, ENABLE_CREATE_UI, DISABLE_CREATE_UI, ENABLE_EDIT_UI,
  DISABLE_EDIT_UI, REQUEST_SELECTS_DATA, RECEIVE_SELECTS_DATA, SELECT_PAGE,
  SET_FILTER_TEXT, SET_TOTAL_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS, ITEM_INSERT_SUCCESS,
  ITEM_INSERT_REQUEST, ITEM_UPDATE_SUCCESS, ITEM_UPDATE_REQUEST, ITEM_DELETE_SUCCESS,
  ITEM_DELETE_REQUEST, REQUIRE_SELECTS_DATA, RECEIVE_MAP_DATA
} from './actionTypes';

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
export const selectPage = (category, page) => ({
  type: SELECT_PAGE,
  category,
  page
});
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
const requireSelectsData = (category) => ({
  type: REQUIRE_SELECTS_DATA,
  category,
});
const setFilterText = (filterText) => ({
  type: SET_FILTER_TEXT,
  filterText
})
const setTotalItems = (category, totalItems) => ({
  type: SET_TOTAL_ITEMS,
  category,
  totalItems
});
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
const receiveMapData = (items) => ({
  type: RECEIVE_MAP_DATA,
  category: 'namai',
  items
});
export const partialFetch = (category, page, perPage) => {
  return (dispatch, getState) => {
    dispatch(requestItems(category));
    const {filterText} = getState();
    const start = (page - 1) * perPage,
          end = start + perPage;
    let totalItems;
    return fetch(`http://localhost:3004/${category}?name_like=${filterText}&_start=${start}&_end=${end}`)
      .then(response => {
        totalItems = response.headers.get('X-Total-Count');
        dispatch(setTotalItems(category, totalItems));
        return response.json();
      }).then(data => {
        const pages = Math.ceil(totalItems / perPage);
        return dispatch(receiveItems(category, data, pages, page));
      });
  }
}
export const fetchItems = (category, page, perPage) => {
  return (dispatch, getState) => {
    dispatch(requestItems(category));
    return select(category).then(data => {
      const pages = Math.ceil(data.length / perPage);
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
      const {page, pages, totalItems} = getState().itemsByCategory[category];

      let newPage = page;
      if (page === pages && totalItems % perPage === 1) newPage = pages - 1;

      return dispatch(partialFetch(category, newPage, perPage));
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
      const {filterText, perPage} = getState();
      const {totalItems, pages} = getState().itemsByCategory[category];
      let page;

      if (item.name.includes(filterText)) {
        if (totalItems % perPage === 0) page = pages + 1;
        else page = pages;
      } else {
        page = 1;
      }
      return dispatch(partialFetch(category, page, perPage));
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
      if (SCHEMA[category].includes(`${updatedCategory}_id`))
        dispatch(requireSelectsData(category))
    });
  }
}
export const setTextAndFetch = (text) => {
  return (dispatch, getState) => {
    const {perPage, selectedCategory} = getState();
    dispatch(setFilterText(text));
    return dispatch(partialFetch(selectedCategory, 1, perPage));
  }
}
export const loopFetch = () => {
  return (dispatch, getState) => {
    const {filterText} = getState();
    const queuedActions = [];
    const intervalTime = 100, interval = 100;
    let totalItems, lastTime = null, lastQueued = null, allLoaded = false;

    function maybeAction() {
      if (queuedActions.length && !lastQueued && !allLoaded) {
        const action = queuedActions.shift();
        const diff = Date.now() - lastTime;

        if (diff >= intervalTime) {
          lastTime = Date.now();
          lastQueued = null;
          dispatch(action);
          maybeAction();
        }
        else  {
          lastQueued = setTimeout(() => {
            lastTime = Date.now();
            lastQueued = null;
            dispatch(action);
            maybeAction();
          }, intervalTime - diff);
        }
      }
    }

    fetch(`http://localhost:3004/namai?name_like${filterText}&_start=${0}&_end=${interval}`)
    .then(response => {
      totalItems = response.headers.get('X-Total-Count');
      return response.json();
    })
    .then(json => {
      const promises = [];
      lastTime = Date.now();
      dispatch(receiveMapData(json));

      for(let start = interval, end = start + interval; start < totalItems; start += interval, end += interval) {
        promises.push(fetch(`http://localhost:3004/namai?name_like${filterText}&_start=${start}&_end=${end}`)
        .then(response => {
          return response.json();
        }).then(json => {
          queuedActions.push(receiveMapData(json));
          maybeAction();
          return json;
        }));
      }

      Promise.all(promises).then(data => {
        data = data.reduce((a, b) => a.concat(b));
        allLoaded = true;
        clearTimeout(lastQueued);
        dispatch(receiveMapData(data));
      });
    });
  }
}
