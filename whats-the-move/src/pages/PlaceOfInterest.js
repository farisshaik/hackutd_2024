import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const POI = () => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const sidebarRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.addEventListener('load', () => setIsScriptLoaded(true));
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
        return () => {
            const script = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!isScriptLoaded) return;

        const initMap = () => {
            try {
                const placesResults = JSON.parse(localStorage.getItem('placesResults')) || [];
                const coordinates = JSON.parse(localStorage.getItem('coordinates')) || [];
                const friends = JSON.parse(localStorage.getItem('friends')) || [];
                const midpoint = JSON.parse(localStorage.getItem('midpoint')); // Get midpoint

                const center = placesResults.length > 0 
                    ? placesResults[0].geometry.location 
                    : coordinates.length > 0 
                        ? { lat: coordinates[0][0], lng: coordinates[0][1] }
                        : { lat: 0, lng: 0 };

                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    zoom: 13,
                    center: center
                });

                setMap(mapInstance);

                const infoWindowInstance = new window.google.maps.InfoWindow();
                setInfoWindow(infoWindowInstance);

                // Add midpoint marker
                if (midpoint) {
                    new window.google.maps.Marker({
                        position: { lat: midpoint.lat, lng: midpoint.lng },
                        map: mapInstance,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        title: 'Midpoint'
                    });
                }

                const placeMarkers = placesResults.map((place, index) => {
                    const marker = new window.google.maps.Marker({
                        position: place.geometry.location,
                        map: mapInstance,
                        title: place.name,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    });

                    marker.addListener('mouseover', () => {
                        const content = `
                            <div style="padding: 8px;">
                                <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name}</h3>
                                <p style="margin: 0;">${place.formatted_address || ''}</p>
                                ${place.rating ? `<p style="margin: 4px 0;">Rating: ${place.rating} ⭐ (${place.user_ratings_total} reviews)</p>` : ''}
                            </div>
                        `;
                        infoWindowInstance.setContent(content);
                        infoWindowInstance.open(mapInstance, marker);
                    });

                    marker.addListener('mouseout', () => {
                        infoWindowInstance.close();
                    });

                    marker.addListener('click', () => {
                        const placeCard = document.getElementById(`place-${index}`);
                        if (placeCard) {
                          placeCard.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest'
                          });
                          
                          // Optional: Add a brief highlight effect to make it more noticeable
                          placeCard.style.backgroundColor = '#f3f4f6';
                          setTimeout(() => {
                            placeCard.style.backgroundColor = 'white';
                          }, 1000);
                        }
                      });

                    return marker;
                });

                const friendMarkers = coordinates.map((coord, index) => {
                    const friend = friends[index] || {};
                    const marker = new window.google.maps.Marker({
                        position: { lat: coord[0], lng: coord[1] },
                        map: mapInstance,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        title: friend.name || `Friend ${index + 1}`
                    });

                    marker.addListener('mouseover', () => {
                        const content = `
                            <div style="padding: 8px;">
                                <h3 style="font-weight: bold; margin-bottom: 4px;">${friend.name || `Friend ${index + 1}`}</h3>
                                <p style="margin: 0;">${friend.location?.description || 'Location not specified'}</p>
                            </div>
                        `;
                        infoWindowInstance.setContent(content);
                        infoWindowInstance.open(mapInstance, marker);
                    });

                    marker.addListener('mouseout', () => {
                        infoWindowInstance.close();
                    });

                    return marker;
                });

                setMarkers([...placeMarkers, ...friendMarkers]);
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();
    }, [isScriptLoaded]);

    const handleGetDirections = () => {
        if (selectedPlace) {
            localStorage.setItem('selectedPlace', JSON.stringify(selectedPlace));
            navigate('/directions');
        }
    };

    return (
        <div className="h-screen flex">
            <div ref={mapRef} className="w-2/3 h-full" />
            <div ref={sidebarRef} className="w-1/3 h-full overflow-y-auto p-4 bg-white">
                {JSON.parse(localStorage.getItem('placesResults'))?.map((place, index) => (
                    <div
                        key={index}
                        id={`place-${index}`}
                        className="mb-8 p-4 border border-gray-200 rounded-lg"
                    >
                        <h2 className="text-2xl font-bold mb-4">{place.name}</h2>
                        <p className="mb-2">{place.formatted_address}</p>
                        {place.rating && (
                            <p className="mb-2">Rating: {place.rating} ⭐ ({place.user_ratings_total} reviews)</p>
                        )}
                        {place.opening_hours && (
                            <p className="mb-2">{place.opening_hours.open_now ? 'Open Now' : 'Closed'}</p>
                        )}
                        {place.photos && place.photos.length > 0 && (
                            <img 
                                src={place.photos[0].url} 
                                alt={place.name} 
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}
                        <button
                            onClick={() => {
                                setSelectedPlace(place);
                                handleGetDirections();
                            }}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                        >
                            Get Directions
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default POI;