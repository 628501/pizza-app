import React, { useState, useEffect } from 'react';
import classes from "./Map.module.css";
import 'leaflet/dist/leaflet.css';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import { toast } from 'react-toastify';

const Map = ({ readOnly, location, onChange }) => {
  return (
    <div className={classes.container}>
       <MapContainer
         className={classes.map}
         center={[0,0]}
         zoom={1}
         dragging={!readOnly}
         touchZoom={!readOnly}
         doubleClickZoom={!readOnly}
         scrollWheelZoom={!readOnly}
         boxZoom={!readOnly}
         keyboard={!readOnly}
         attributionControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <FindButtonAndMarker
              readOnly={readOnly}
              location={location}
              onChange={onChange}
              />
         </MapContainer>
    </div>
  )
}

export default Map

function FindButtonAndMarker({ readOnly, location, onChange}){
    const [position,setPosition] = useState(location);

    useEffect(() => {
        if(readOnly) {
            map.setView(position, 13);
            return;
        }
        if (position) onChange(position);
    }, [position])

    const map = useMapEvents({
        click(e){
            !readOnly && setPosition(e.latlng)
        },
        locationfound(e){
            setPosition(e.latlng);
            map.flyTo(e.latlng, 13);
        },
        locationerror(e){
            toast.error(e.message)
        },
    });
    return (
        <>
         {!readOnly && (
            <button
              type='button'
              className={classes.find_location}
              onClick={()=>map.locate()}
              >
                Find My Location 
              </button>
         )}

         {position && (
            <Marker
              eventHandlers={{
                dragend: e => {
                    setPosition(e.target.getLatLng());
                },
              }}
              position={position}
              draggable={!readOnly}
              >
                <Popup>Shipping Location</Popup>
              </Marker>
         )}
        </>
    )
}
