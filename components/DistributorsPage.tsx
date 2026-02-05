import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, MapPin, Phone, Clock, Search } from 'lucide-react';
import { BRAND_COLORS, COMPANY_INFO } from '../constants';

// Fix pour les icones Leaflet par défaut qui ne s'affichent pas bien avec React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icone personnalisée pour l'utilisateur (style Yango/Uber)
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Icone pour les distributeurs (Rouge Maji Safi)
const distributorIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Mock data pour les distributeurs à Bunia
const DISTRIBUTORS = [
    {
        id: 1,
        name: "Relais Ma Campagne",
        address: "Av. Ma Campagne, Réf. Rond point",
        lat: 1.5646,
        lng: 30.2505,
        phone: "+243 81 000 0001",
        hours: "07:00 - 20:00"
    },
    {
        id: 2,
        name: "Dépôt Cité Verte",
        address: "Quartier Cité Verte, Arrêt Bus",
        lat: 1.5700,
        lng: 30.2550,
        phone: "+243 81 000 0002",
        hours: "06:30 - 21:00"
    },
    {
        id: 3,
        name: "Distribution Marché Central",
        address: "Marché Central de Bunia, Entrée Principale",
        lat: 1.5580,
        lng: 30.2480,
        phone: "+243 81 000 0003",
        hours: "08:00 - 18:00"
    },
    {
        id: 4,
        name: "Point Relais Yambi Yaya",
        address: "Av. Yambi Yaya, Près de l'école",
        lat: 1.5600,
        lng: 30.2600,
        phone: "+243 81 000 0004",
        hours: "07:00 - 19:00"
    }
];

// Composant pour recentrer la carte
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 15);
    }, [lat, lng]);
    return null;
};

const DistributorsPage: React.FC = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedDistributor, setSelectedDistributor] = useState<typeof DISTRIBUTORS[0] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour obtenir la localisation
    const handleLocateMe = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLoading(false);
            },
            (err) => {
                console.error(err);
                // Fallback à Bunia si erreur (pour la démo)
                setUserLocation({ lat: 1.5646, lng: 30.2505 });
                setError("Impossible de vous localiser précisément. Position par défaut (Bunia).");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // Initialisation : On demande la localisation au chargement
    useEffect(() => {
        handleLocateMe();
    }, []);

    const openItinerary = (destLat: number, destLng: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
        window.open(url, '_blank');
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl relative">

            {/* Sidebar Liste (Overlay sur mobile comme Yango) */}
            <div className={`
        absolute md:relative z-[1000] bottom-0 left-0 right-0 md:w-96 bg-white md:h-full 
        transition-transform duration-300 rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none
        flex flex-col max-h-[60vh] md:max-h-full
        ${selectedDistributor ? 'translate-y-0' : 'translate-y-[calc(100%-80px)] md:translate-y-0'}
      `}>
                {/* Poignée mobile */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2 md:hidden"></div>

                <div className="p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Distributeurs</h2>
                    <p className="text-slate-500 text-sm">Trouvez le point relais Maji Safi le plus proche de vous.</p>

                    <button
                        onClick={handleLocateMe}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-[#0066CC] rounded-xl font-bold hover:bg-blue-100 transition-colors"
                    >
                        <Navigation size={18} className={loading ? "animate-spin" : ""} />
                        {loading ? "Localisation..." : "Ma position actuelle"}
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-3 pb-24 md:pb-4">
                    {DISTRIBUTORS.map(dist => (
                        <div
                            key={dist.id}
                            onClick={() => setSelectedDistributor(dist)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedDistributor?.id === dist.id
                                    ? 'border-[#0066CC] bg-blue-50 shadow-md transform scale-[1.02]'
                                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{dist.name}</h3>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">OUVERT</span>
                            </div>

                            <div className="flex items-start gap-2 text-slate-600 text-sm mb-2">
                                <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="line-clamp-2">{dist.address}</p>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Clock size={14} /> {dist.hours}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone size={14} /> {dist.phone}
                                </div>
                            </div>

                            {selectedDistributor?.id === dist.id && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openItinerary(dist.lat, dist.lng);
                                    }}
                                    className="mt-4 w-full py-3 bg-[#0066CC] text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300"
                                >
                                    <Navigation size={18} />
                                    Commencer l'itinéraire
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Carte */}
            <div className="flex-1 h-full w-full bg-slate-100 relative z-0">
                {typeof window !== 'undefined' && userLocation ? (
                    <MapContainer
                        center={[userLocation.lat, userLocation.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* User Marker */}
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                            <Popup>Vous êtes ici</Popup>
                        </Marker>

                        {/* Distributors Markers */}
                        {DISTRIBUTORS.map(dist => (
                            <Marker
                                key={dist.id}
                                position={[dist.lat, dist.lng]}
                                icon={distributorIcon}
                                eventHandlers={{
                                    click: () => setSelectedDistributor(dist),
                                }}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold">{dist.name}</h3>
                                        <p className="text-xs text-slate-500">{dist.address}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Auto-center on selected item */}
                        {selectedDistributor && (
                            <RecenterMap lat={selectedDistributor.lat} lng={selectedDistributor.lng} />
                        )}
                    </MapContainer>
                ) : (
                    <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin mb-4">
                                <Navigation size={32} className="text-[#0066CC]" />
                            </div>
                            <p>Chargement de la carte...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <Search size={16} />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorsPage;
