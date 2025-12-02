function Map() {
  return (
    <iframe
      id="map-canvas"
      className="map_part"
      width="100%"
      height="100%"
      style={{
        borderRadius: "4px",
        border: "1px solid var(--grey20)",
        height: "100%",
      }}
      src="https://maps.google.com/maps?width=100%&amp;height=100%&amp;hl=en&amp;q=North Florida Chiropractic Physical Therapy&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
    />
  );
}

export default Map;
