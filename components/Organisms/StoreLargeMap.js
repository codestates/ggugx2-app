import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { MapView } from 'expo';

export default class StoreLargeMap extends Component {
  constructor(props) {
    super(props);
    const { latitude, longitude } = props.coordinates;
    this.state = {
      mapRegion: {
        latitude,
        longitude,
        latitudeDelta: 0.0011,
        longitudeDelta: 0.0011
      }
    };
  }

  // _handleMapRegionChange = mapRegion => {
  //   this.setState({ mapRegion });
  // };

  render() {
    const { latitude, longitude } = this.state.mapRegion;
    return (
      <View>
        {/* TODO: 마커가 안찍힌다... */}
        <MapView.Marker
          coordinate={{
            latitude, //: this.props.latitude,
            longitude //: this.props.longitude
          }}
          title={'here'}
          description={'desc'}
        />
        <MapView
          style={{
            alignSelf: 'stretch',
            height: 200,
            width: '90%',
            borderWidth: 1,
            borderColor: 'gray',
            alignSelf: 'center',
            marginVertical: 10
          }}
          region={this.state.mapRegion}
          provider={MapView.PROVIDER_GOOGLE}
          // onRegionChange={this._handleMapRegionChange}
        />
      </View>
    );
  }
}
