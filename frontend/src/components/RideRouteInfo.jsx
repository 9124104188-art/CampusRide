function formatRouteValue(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.text || "";
}

function RideRouteInfo({ ride }) {
  const distance = formatRouteValue(ride.distance);
  const duration = formatRouteValue(ride.duration);
  const hasRouteInfo = Boolean(distance || duration);

  return (
    <div className="route-info">
      {hasRouteInfo ? (
        <>
          <div>
            <span>Distance</span>
            <strong>{distance || "Not available"}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{duration || "Not available"}</strong>
          </div>
        </>
      ) : (
        <p>Route info unavailable for this ride.</p>
      )}
    </div>
  );
}

export default RideRouteInfo;