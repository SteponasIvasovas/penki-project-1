import React from 'react';
import {connect} from 'react-redux';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {loopFetch} from '../actions';

const API_KEY = 'AIzaSyAY4i3QJhpO-L1zXUWoD2isnrGh3vODl_M';

export class MapContainer extends React.Component {
  // allItems = this.props.items;
  componentDidMount() {
    this.props.loadMapData();
    // allItems = this.props.items;
    // console.log('hello');
  }
  componentDidUpdate() {
    // allItems.concat(this.props.items)
  }
  onMarkerClick = (props, marker, e) => {
  }
  render() {
    const {items} = this.props;
    let itemsUI;
    if (items) {
      // const keys = Object.keys(items);
      // const firstItem = keys.length > 0 ? items[keys[0]] : null;
      // if (firstItem && firstItem.location) {
        itemsUI = items.map(item => {
          // const item = items[key];
          let {lat, lng} = item.location;

          lat = lat > 0 ? Math.min(lat, 80) : Math.max(lat, -80);

          if (lng > 180) lng = -360 + lng;
          else if (lng < -180) lng = 360 + lng;
          return (
            <Marker
              key={item.id}
              name={item.name}
              position={{lat, lng}}
              onClick={this.onMarkerClick}
            />
          );
        });
    }

    return (
      <Map google={this.props.google} zoom={2}>
        {itemsUI}
      </Map>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    items: state.mapData.items,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadMapData: () => dispatch(loopFetch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
  apiKey:  API_KEY
})(MapContainer))
