import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { PRESTIGE_LEVELS } from '../data/mockData';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix for default marker icon in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom);
    }, [center, zoom]);
    return null;
};

const MapComponent = ({ services, selectedCategory }) => {
    // Default center (Buenos Aires Obelisco approx)
    const defaultCenter = [-34.6037, -58.3816];

    return (
        <div className="map-wrapper">
            <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} className="leaflet-map" attributionControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ChangeView center={defaultCenter} zoom={13} />

                {services.map(service => (
                    <Marker key={service.id} position={[service.location.lat, service.location.lng]}>
                        <Popup>
                            <div className="map-popup">
                                <strong>{service.name}</strong><br />
                                {service.serviceTitle}<br />
                                <span style={{ color: PRESTIGE_LEVELS[service.prestige]?.color, fontWeight: 'bold' }}>
                                    {service.prestige}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
