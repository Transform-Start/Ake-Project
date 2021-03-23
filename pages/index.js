import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { compose, withProps } from "recompose"
import {InfoWindow, withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { Component } from 'react';
import Geocode from "react-geocode";
import { Descriptions } from 'antd';
import Autocomplete from 'react-google-autocomplete';
import { FcAndroidOs } from "react-icons/fc";
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

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onPlaceSelected = (place) => {
        console.log('plc', place);
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

        console.log('latvalue', latValue)
        console.log('lngValue', lngValue)

        // Set these values in the state.
        this.setState({
            address: (address) ? address : '',
            area: (area) ? area : '',
            city: (city) ? city : '',
            state: (state) ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        })
    };


  render() {
    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
      >
      
         <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}
          icon={<FcAndroidOs/>}
        >
           <InfoWindow
           position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
           >
          <div>Hello Me here</div>
          </InfoWindow>
        </Marker>
          <Autocomplete
              style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '16px',
                  marginTop: '2px',
                  marginBottom: '2rem'
              }}
              onPlaceSelected={this.onPlaceSelected}
              types={['(regions)']}
          />

      {/*  {parkData.features.map(park => (*/}
      {/*  <Marker*/}
      {/*    key={park.properties.PARK_ID}*/}
      {/*    position={{*/}
      {/*      lat: park.geometry.coordinates[0],*/}
      {/*      lng: park.geometry.coordinates[1]*/}
      {/*    }}*/}
      {/*    onClick={() => {*/}
      {/*      setSelectedPark(park);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*      <InfoWindow*/}
      {/*      key={park.properties.PARK_ID}*/}
      {/*      position={{ lat:park.geometry.coordinates[0], lng: park.geometry.coordinates[1] }}*/}
      {/*      >*/}
      {/*     <div>Hello Me here</div>*/}
      {/*     </InfoWindow>*/}
      {/*      </Marker>*/}
      {/*  */}
      {/*))}*/}
      {/* {
          parkData.features.map(park=>(
            
          ))
      } */}
      
        
      </GoogleMap>
    ));
    return (
        <div style={{ padding: '1rem', margin: '0 auto', maxWidth: 1000 }}>

            <Descriptions bordered>
                <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
                <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
                <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
                <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
            </Descriptions>

      <MapWithAMarker
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAPsKRXSoF9BZ9Sx0uXhtnMcx7osRa5OsI&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: this.state.height }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
        </div>
    )
  }
}


export default Home;


