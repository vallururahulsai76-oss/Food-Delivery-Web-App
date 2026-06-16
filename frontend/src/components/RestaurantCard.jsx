export default function RestaurantCard({ restaurant: r, onClick }) {
  return (
    <div onClick={onClick} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'} onMouseOut={e => e.currentTarget.style.boxShadow='none'}>
      {r.image ? (
        <img
          src={encodeURI(r.image)}
          alt={r.name}
          style={{ width: '100%', height: 140, objectFit: 'contain', background: '#f5f5f5', display: 'block' }}
          onError={e => { e.target.onerror = null; e.target.style.objectFit = 'contain'; }}
        />
      ) : (
        <div style={{ width: '100%', height: 140, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
          🍽️
        </div>
      )}
      <div style={{ padding: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.name}</div>
        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#666', marginBottom: 8 }}>
          <span>⭐ {r.rating}</span>
          <span>🕐 {r.deliveryTime}</span>
          <span>🛵 ₹{r.deliveryFee}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {r.cuisine?.map(c => <span key={c} style={{ background: '#f5f5f5', borderRadius: 99, padding: '2px 10px', fontSize: 11, color: '#555' }}>{c}</span>)}
        </div>
      </div>
    </div>
  )
}