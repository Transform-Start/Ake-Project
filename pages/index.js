import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { compose, withProps } from "recompose"
import {InfoWindow, withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { Component } from 'react';
import Geocode from "react-geocode";
import * as parkData from "./data/testing.json";


Geocode.setApiKey("AIzaSyAPsKRXSoF9BZ9Sx0uXhtnMcx7osRa5OsI");
Geocode.enableDebug();

class Home extends React.Component {

        state = {
          address: '',
          city: '',
          area: '',
          state: '',
          zoom: 15,
          height: 400,
          mapPosition: {
              lat: 0,
              lng: 0,
          },
          markerPosition: {
              lat: 0,
              lng: 0,
          }
            }

            componentDidMount() {
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(position => {
                      this.setState({
                          mapPosition: {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude,
                          },
                          markerPosition: {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude,
                          }
                      },
                          () => {
                              Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                                  response => {
                                      console.log(response)
                                      const address = response.results[0].formatted_address,
                                          addressArray = response.results[0].address_components,
                                          city = this.getCity(addressArray),
                                          area = this.getArea(addressArray),
                                          state = this.getState(addressArray);
                                      console.log('city', city, area, state);
                                      this.setState({
                                          address: (address) ? address : '',
                                          area: (area) ? area : '',
                                          city: (city) ? city : '',
                                          state: (state) ? state : '',
                                      })
                                  },
                                  error => {
                                      console.error(error);
                                  }
                              );
      
                          })
                  });
              } else {
                  console.error("Geolocation is not supported by this browser!");
              }
          };   
             
      getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
      };

      getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
      };

      getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
      };

      onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                })
            },
            error => {
                console.error(error);
            }
        );
      };


  render() {
    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={this.state.zoom}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
      >
      
        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}
        >
           <InfoWindow
           position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
           >
          <div>Hello Me here</div>
          </InfoWindow>
        </Marker>  
        
      </GoogleMap>
    ));
    return (
      <MapWithAMarker
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAPsKRXSoF9BZ9Sx0uXhtnMcx7osRa5OsI&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `600px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
    )
  }
}


export default Home;


