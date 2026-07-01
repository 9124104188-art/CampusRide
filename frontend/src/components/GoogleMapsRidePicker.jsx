import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
let mapsLoaderPromise = null;

const loadGoogleMaps = (apiKey) => {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is missing"));
  }

  if (!mapsLoaderPromise) {
    mapsLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById("google-maps-script");

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.google), { once: true });
        existingScript.addEventListener(
          "error",
          () => {
            reject(new Error("Failed to load Google Maps"));
          },
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(script);
    });
  }

  return mapsLoaderPromise;
};

const toLatLngLiteral = (location) => {
  if (!location) {
    return null;
  }

  if (typeof location.toJSON === "function") {
    return location.toJSON();
  }

  if (typeof location.lat === "function" && typeof location.lng === "function") {
    return { lat: location.lat(), lng: location.lng() };
  }

  if (typeof location.lat === "number" && typeof location.lng === "number") {
    return location;
  }

  return null;
};

function GoogleMapsRidePicker({ value, onChange }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapContainerRef = useRef(null);
  const pickupWidgetMountRef = useRef(null);
  const destinationWidgetMountRef = useRef(null);
  const mapRef = useRef(null);
  const latestValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const [loadState, setLoadState] = useState(apiKey ? "loading" : "missing");
  const [statusMessage, setStatusMessage] = useState(
    apiKey
      ? "Select pickup and destination from Google suggestions to preview the route."
      : "Set VITE_GOOGLE_MAPS_API_KEY to enable route preview and autocomplete."
  );
  const { pickupLatLng, destinationLatLng } = value;

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    if (!apiKey) {
      return undefined;
    }

    loadGoogleMaps(apiKey)
      .then(() => {
        if (!cancelled) {
          setLoadState("ready");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState("error");
          setStatusMessage(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  const clearRouteOverlays = useCallback(() => {
    if (mapRef.current?.__rideRoutePolylines) {
      mapRef.current.__rideRoutePolylines.forEach((polyline) => polyline.setMap(null));
      mapRef.current.__rideRoutePolylines = [];
    }

    if (mapRef.current?.__rideRouteMarkers) {
      mapRef.current.__rideRouteMarkers.forEach((marker) => marker.setMap(null));
      mapRef.current.__rideRouteMarkers = [];
    }
  }, []);

  useEffect(() => {
    if (loadState !== "ready" || !mapContainerRef.current || !window.google?.maps) {
      return undefined;
    }

    let cancelled = false;
    const cleanupFns = [];
    const pickupMountNode = pickupWidgetMountRef.current;
    const destinationMountNode = destinationWidgetMountRef.current;

    const initMapAndWidgets = async () => {
      const [{ PlaceAutocompleteElement }] = await Promise.all([
        window.google.maps.importLibrary("places"),
      ]);

      if (cancelled) {
        return;
      }

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });

      mapRef.current = map;
      mapRef.current.__rideRoutePolylines = [];
      mapRef.current.__rideRouteMarkers = [];

      const attachAutocomplete = async (mountRef, fieldName, label) => {
        if (!mountRef.current) {
          return;
        }

        mountRef.current.replaceChildren();
        const element = new PlaceAutocompleteElement();
        element.placeholder = `Search ${label}`;
        element.classList.add("maps-autocomplete-widget");
        mountRef.current.appendChild(element);

        const handler = async ({ placePrediction }) => {
          try {
            const place = placePrediction.toPlace();
            await place.fetchFields({
              fields: ["displayName", "formattedAddress", "location", "viewport"],
            });

            const location = toLatLngLiteral(place.location);

            if (!location) {
              setStatusMessage(`Choose the ${label} location from Google suggestions.`);
              return;
            }

            const nextValue = place.formattedAddress || place.displayName || "";

            onChangeRef.current({
              ...latestValueRef.current,
              [fieldName]: nextValue,
              [`${fieldName}LatLng`]: location,
              distance: "",
              duration: "",
            });

            setStatusMessage(`${label.charAt(0).toUpperCase() + label.slice(1)} location selected.`);

            if (place.viewport) {
              map.fitBounds(place.viewport);
            } else {
              map.setCenter(location);
              map.setZoom(15);
            }
          } catch {
            setStatusMessage(`Choose the ${label} location from Google suggestions.`);
          }
        };

        element.addEventListener("gmp-select", handler);
        cleanupFns.push(() => element.removeEventListener("gmp-select", handler));
      };

      await attachAutocomplete({ current: pickupMountNode }, "pickup", "pickup location");
      await attachAutocomplete(
        { current: destinationMountNode },
        "destination",
        "destination"
      );
    };

    void initMapAndWidgets().catch(() => {
      if (!cancelled) {
        setLoadState("error");
        setStatusMessage("Unable to initialize Google Maps right now.");
      }
    });

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      clearRouteOverlays();

      if (pickupMountNode) {
        pickupMountNode.replaceChildren();
      }

      if (destinationMountNode) {
        destinationMountNode.replaceChildren();
      }

      mapRef.current = null;
    };
  }, [clearRouteOverlays, loadState]);

  useEffect(() => {
    if (loadState !== "ready" || !mapRef.current || !window.google?.maps) {
      return undefined;
    }

    if (!pickupLatLng || !destinationLatLng) {
      clearRouteOverlays();
      return undefined;
    }

    let cancelled = false;

    const drawRoute = async () => {
      try {
        const { Route } = await window.google.maps.importLibrary("routes");

        if (cancelled) {
          return;
        }

        clearRouteOverlays();

        const result = await Route.computeRoutes({
          origin: pickupLatLng,
          destination: destinationLatLng,
          travelMode: "DRIVING",
          fields: ["path", "legs", "viewport"],
        });

        const route = result.routes?.[0];

        if (!route) {
          throw new Error("No routes found");
        }

        const polylines = route.createPolylines();
        polylines.forEach((polyline) => polyline.setMap(mapRef.current));
        mapRef.current.__rideRoutePolylines = polylines;

        const originMarker = new window.google.maps.Marker({
          map: mapRef.current,
          position: pickupLatLng,
          label: "A",
        });
        const destinationMarker = new window.google.maps.Marker({
          map: mapRef.current,
          position: destinationLatLng,
          label: "B",
        });

        mapRef.current.__rideRouteMarkers = [originMarker, destinationMarker];

        if (route.viewport) {
          mapRef.current.fitBounds(route.viewport);
        }

        const leg = route.legs?.[0];
        const nextDistance = {
          text: leg?.distance?.text || "",
          value: leg?.distance?.value || 0,
        };
        const nextDuration = {
          text: leg?.duration?.text || "",
          value: leg?.duration?.value || 0,
        };

        onChangeRef.current({
          ...latestValueRef.current,
          distance: nextDistance,
          duration: nextDuration,
        });

        setStatusMessage(`${nextDistance.text} • ${nextDuration.text}`);
      } catch {
        if (!cancelled) {
          setStatusMessage("Unable to draw the route preview right now.");
          onChangeRef.current({
            ...latestValueRef.current,
            distance: "",
            duration: "",
          });
          clearRouteOverlays();
        }
      }
    };

    void drawRoute();

    return () => {
      cancelled = true;
    };
  }, [clearRouteOverlays, loadState, pickupLatLng, destinationLatLng]);

  const routeSummary = useMemo(() => {
    const distanceText =
      typeof value.distance === "string" ? value.distance : value.distance?.text || "";
    const durationText =
      typeof value.duration === "string" ? value.duration : value.duration?.text || "";

    return [distanceText, durationText].filter(Boolean).join(" • ");
  }, [value.distance, value.duration]);

  const helperMessage = useMemo(() => {
    if (loadState === "loading") {
      return "Loading Google Maps...";
    }

    if (loadState === "error" || loadState === "missing") {
      return statusMessage;
    }

    if (!pickupLatLng || !destinationLatLng) {
      return "Select both pickup and destination from Google suggestions to preview the route.";
    }

    return routeSummary || statusMessage;
  }, [loadState, pickupLatLng, destinationLatLng, routeSummary, statusMessage]);

  return (
    <section className="maps-panel">
      <div className="page-header maps-header">
        <div>
          <h2>Pickup and destination</h2>
          <p>Select from Google suggestions to save coordinates and preview the route.</p>
        </div>
      </div>

      <div className="form-grid form-grid-2 location-input-grid">
        <label className="field">
          <span>Pickup</span>
          <div className="autocomplete-slot" ref={pickupWidgetMountRef} />
        </label>

        <label className="field">
          <span>Destination</span>
          <div className="autocomplete-slot" ref={destinationWidgetMountRef} />
        </label>
      </div>

      <div className="map-shell">
        {loadState !== "ready" && <p className="map-message">{helperMessage}</p>}

        {loadState === "ready" && (
          <div className="map-preview" ref={mapContainerRef} aria-label="Route preview map" />
        )}
      </div>

      <div className="route-summary">
        <span>Route info</span>
        <strong>{helperMessage}</strong>
      </div>
    </section>
  );
}

export default GoogleMapsRidePicker;