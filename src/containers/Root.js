import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../scripts/configureStore';
import Main from './Main';

const store = configureStore();

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    )
  }
}
