function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingSpinner;