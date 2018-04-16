import React from 'react';
import {connect} from 'react-redux';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {loopFetch} from '../actions';

const API_KEY = 'AIzaSyAY4i3QJhpO-L1zXUWoD2isnrGh3vODl_M';

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: null,
    selectedPlace: {}
  }
  componentDidMount() {
    this.props.loadMapData();
  }
  componentDidUpdate() {
  }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }
  onMarkerClick = (props, marker, e) => {
    console.log(props);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow : true
    });
  }
  render() {
    const {items} = this.props;
    let itemsUI;
    if (items) {
      const ids = Object.keys(items);
      const firstItem = ids.length > 0 ? items[ids[0]] : null;
      if (firstItem && firstItem.location) {
        itemsUI = ids.map(id => {
          const item = items[id];
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
    }

    return (
      <Map google={this.props.google} zoom={2}>
        {itemsUI}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h2>{this.state.selectedPlace.name}</h2>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    items: state.entities['namai'],
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadMapData: () => dispatch(loopFetch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
  apiKey: API_KEY
})(MapContainer))
