import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Navigation, MapPin, Phone, Clock, Search } from 'lucide-react';

// Fix pour les icones Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icone utilisateur (Bleu Maji Safi)
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Icone distributeur (Rouge Marque)
const distributorIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Données fictives (Bunia)
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

// Composant Routing (Itinéraire)
const RoutingControl = ({ start, end }: { start: { lat: number, lng: number }, end: { lat: number, lng: number } }) => {
    const map = useMap();
    const routingControlRef = useRef<any>(null);

    useEffect(() => {
        if (!start || !end) return;

        // Nettoyage ancien itinéraire
        if (routingControlRef.current) {
            try {
                map.removeControl(routingControlRef.current);
            } catch (e) {
                console.warn("Erreur suppression contrôle", e);
            }
            routingControlRef.current = null;
        }

        // Création nouvel itinéraire
        // @ts-ignore
        routingControlRef.current = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            lineOptions: {
                styles: [{ color: '#0066CC', opacity: 0.8, weight: 6 }]
            },
            createMarker: () => null, // Pas de marqueurs additionnels
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            containerClassName: 'hidden', // Cache les instructions textuelles
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                language: 'fr'
            })
        }).addTo(map);

        // Cacher container instructions
        const container = routingControlRef.current.getContainer();
        if (container) container.style.display = 'none';

        return () => {
            if (routingControlRef.current) {
                try {
                    map.removeControl(routingControlRef.current);
                } catch (e) { }
                routingControlRef.current = null;
            }
        };
    }, [map, start, end]);

    return null;
};

// Composant Recentrer
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
    const [isNavigating, setIsNavigating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLocateMe = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Géolocalisation non supportée");
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
                setUserLocation({ lat: 1.5646, lng: 30.2505 }); // Bunia default
                setError("Localisation impossible. Position par défaut (Bunia).");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        handleLocateMe();
    }, []);

    const startNavigation = () => {
        if (userLocation && selectedDistributor) {
            setIsNavigating(true);
        }
    };

    const stopNavigation = () => {
        setIsNavigating(false);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl relative">

            {/* Sidebar */}
            <div className={`
        absolute md:relative z-[1000] bottom-0 left-0 right-0 md:w-96 bg-white md:h-full 
        transition-transform duration-300 rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none
        flex flex-col max-h-[60vh] md:max-h-full
        ${selectedDistributor ? 'translate-y-0' : 'translate-y-[calc(100%-80px)] md:translate-y-0'}
      `}>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2 md:hidden"></div>

                <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-black text-slate-900">Distributeurs</h2>
                        {isNavigating && (
                            <button onClick={stopNavigation} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-100">
                                Arrêter
                            </button>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm mb-4">Maji Safi Ya Kuetu - Points Relais</p>

                    <button
                        onClick={handleLocateMe}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-[#0066CC] rounded-xl font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                        <Navigation size={18} className={loading ? "animate-spin" : ""} />
                        {loading ? "Localisation..." : "Ma position actuelle"}
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-3 pb-24 md:pb-4">
                    {DISTRIBUTORS.map(dist => (
                        <div
                            key={dist.id}
                            onClick={() => {
                                setSelectedDistributor(dist);
                                if (dist.id !== selectedDistributor?.id) setIsNavigating(false);
                            }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedDistributor?.id === dist.id
                                    ? 'border-[#0066CC] bg-blue-50 shadow-md ring-1 ring-blue-100'
                                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{dist.name}</h3>
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full">OUVERT</span>
                            </div>

                            <div className="flex items-start gap-2 text-slate-600 text-sm mb-3">
                                <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="line-clamp-2 text-xs">{dist.address}</p>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-200/50">
                                <div className="flex items-center gap-1"><Clock size={12} /> {dist.hours}</div>
                                <div className="flex items-center gap-1"><Phone size={12} /> {dist.phone}</div>
                            </div>

                            {selectedDistributor?.id === dist.id && !isNavigating && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startNavigation();
                                    }}
                                    className="mt-4 w-full py-3 bg-[#0066CC] text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Navigation size={18} />
                                    Y aller maintenant
                                </button>
                            )}

                            {selectedDistributor?.id === dist.id && isNavigating && (
                                <div className="mt-4 text-center text-sm font-bold text-[#0066CC] animate-pulse">
                                    Itinéraire en cours...
                                </div>
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
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        {/* Tuiles CartoDB Positron pour style épuré */}
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />

                        {isNavigating && selectedDistributor && (
                            <RoutingControl start={userLocation} end={selectedDistributor} />
                        )}

                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                            <Popup>Vous êtes ici</Popup>
                        </Marker>

                        {DISTRIBUTORS.map(dist => (
                            <Marker
                                key={dist.id}
                                position={[dist.lat, dist.lng]}
                                icon={distributorIcon}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedDistributor(dist);
                                        setIsNavigating(false);
                                    },
                                }}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-sm">{dist.name}</h3>
                                        <p className="text-xs text-slate-500 mb-2">{dist.address}</p>
                                        <button
                                            onClick={() => {
                                                setSelectedDistributor(dist);
                                                startNavigation();
                                            }}
                                            className="w-full bg-[#0066CC] text-white text-xs py-1 px-2 rounded font-bold"
                                        >
                                            Y aller
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {selectedDistributor && !isNavigating && (
                            <RecenterMap lat={selectedDistributor.lat} lng={selectedDistributor.lng} />
                        )}
                    </MapContainer>
                ) : (
                    <div className="h-full flex items-center justify-center bg-slate-50">
                        <div className="flex flex-col items-center animate-pulse">
                            <Navigation size={32} className="text-[#0066CC] mb-4" />
                            <p className="text-slate-400 font-medium">Chargement de la carte...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white text-red-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg border border-red-100 flex items-center gap-2">
                        <Search size={14} /> {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorsPage;
