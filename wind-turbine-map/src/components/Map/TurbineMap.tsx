import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WindTurbine } from '../../types/turbine';
import { 
  DENMARK_CENTER, 
  DEFAULT_ZOOM, 
  utmToLatLng, 
  getMarkerColor,
  formatCapacity,
  formatDate 
} from '../../utils/mapHelpers';
import './TurbineMap.css';

interface TurbineMapProps {
  turbines: WindTurbine[];
  colorBy?: 'manufacturer' | 'age' | 'capacity';
}

export function TurbineMap({ turbines, colorBy = 'manufacturer' }: TurbineMapProps) {
  // Create custom icon function
  const createIcon = (color: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <MapContainer
      center={DENMARK_CENTER}
      zoom={DEFAULT_ZOOM}
      className="turbine-map"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {turbines.map(turbine => {
        // Skip turbines without coordinates
        if (!turbine.coordinateX || !turbine.coordinateY) {
          return null;
        }

        const position = utmToLatLng(turbine.coordinateX, turbine.coordinateY);
        if (!position) {
          return null;
        }

        const color = getMarkerColor(turbine, colorBy);
        const icon = createIcon(color);

        return (
          <Marker key={turbine.id} position={position} icon={icon}>
            <Popup>
              <div className="turbine-popup">
                <h3 className="turbine-popup-title">
                  {turbine.manufacturer || 'Unknown'} {turbine.typeDesignation || ''}
                </h3>
                <div className="turbine-popup-details">
                  <div className="turbine-popup-row">
                    <strong>GSRN:</strong> {turbine.gsrn}
                  </div>
                  <div className="turbine-popup-row">
                    <strong>Capacity:</strong> {formatCapacity(turbine.capacityKw)}
                  </div>
                  <div className="turbine-popup-row">
                    <strong>Hub Height:</strong> {turbine.hubHeightM ? `${turbine.hubHeightM} m` : 'N/A'}
                  </div>
                  <div className="turbine-popup-row">
                    <strong>Rotor Diameter:</strong> {turbine.rotorDiameterM ? `${turbine.rotorDiameterM} m` : 'N/A'}
                  </div>
                  <div className="turbine-popup-row">
                    <strong>Location:</strong> {turbine.localAuthority || 'N/A'}
                  </div>
                  {turbine.siteName && (
                    <div className="turbine-popup-row">
                      <strong>Site:</strong> {turbine.siteName}
                    </div>
                  )}
                  <div className="turbine-popup-row">
                    <strong>Type:</strong> {turbine.locationType || 'N/A'}
                  </div>
                  <div className="turbine-popup-row">
                    <strong>Connected:</strong> {formatDate(turbine.originalConnectionDate)}
                  </div>
                  {turbine.decommissioningDate && (
                    <div className="turbine-popup-row">
                      <strong>Decommissioned:</strong> {formatDate(turbine.decommissioningDate)}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
