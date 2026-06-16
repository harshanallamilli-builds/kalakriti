export default function ProductLoading() {
  return (
    <div className="pd-root">
      {/* back row skeleton */}
      <div className="pd-back-row">
        <div className="pd-skel pd-skel--back" />
      </div>

      <div className="pd-grid">
        {/* image skeleton */}
        <div className="pd-images">
          <div className="pd-img-main pd-img-main--loading">
            <div className="pd-skel-shimmer" />
          </div>
        </div>

        {/* info skeleton */}
        <div className="pd-info">
          {/* creator strip */}
          <div className="pd-skel-creator">
            <div className="pd-skel pd-skel--avatar" />
            <div className="pd-skel-creator__lines">
              <div className="pd-skel pd-skel--name" />
              <div className="pd-skel pd-skel--loc" />
            </div>
          </div>

          {/* title block */}
          <div className="pd-title-block" style={{ marginTop: "2rem" }}>
            <div className="pd-skel pd-skel--cat" />
            <div className="pd-skel pd-skel--heading" style={{ marginTop: "0.75rem" }} />
            <div className="pd-skel pd-skel--heading pd-skel--heading-short" style={{ marginTop: "0.5rem" }} />
            <div className="pd-skel pd-skel--price" style={{ marginTop: "1.25rem" }} />
          </div>

          {/* desc lines */}
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="pd-skel pd-skel--line" />
            <div className="pd-skel pd-skel--line" />
            <div className="pd-skel pd-skel--line pd-skel--line-short" />
          </div>

          {/* trust */}
          <div className="pd-skel-trust">
            {[1,2,3].map(i => (
              <div key={i} className="pd-skel pd-skel--trust-item" />
            ))}
          </div>

          {/* actions */}
          <div className="pd-skel-actions">
            <div className="pd-skel pd-skel--action-block" />
            <div className="pd-skel pd-skel--action-block pd-skel--action-block-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}