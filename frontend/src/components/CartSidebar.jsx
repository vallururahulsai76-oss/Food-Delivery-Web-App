import { useApp } from '../context/useApp'
import { placeOrder } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CartSidebar({ isOpen = false, setIsOpen = () => {}, restaurantId }) {
  const { cart, removeFromCart, addToCart, emptyCart: clearCart, cartTotal: totalAmount, user } = useApp()
  const navigate = useNavigate()

  const currentRestaurantId = restaurantId || cart[0]?.restaurantId;

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return }
    if (!cart.length) return
    if (!currentRestaurantId) { toast.error('Unable to place order'); return }
    try {
      await placeOrder({
        restaurantId: currentRestaurantId,
        items: cart.map(i => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        deliveryAddress: user.address || { street: '123 Main St', city: 'Nellore', state: 'AP', zipCode: '524001' },
        paymentMethod: 'cash'
      })
      await clearCart()
      setIsOpen(false)
      toast.success('Order placed! 🎉')
      navigate('/orders')
    } catch { toast.error('Failed to place order') }
  }

  if (!isOpen) return null

  return (
    <>
      <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 340, background: '#fff', zIndex: 100, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>🛒 Your Cart</h3>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {!cart.length ? <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Your cart is empty</div> : cart.map(item => {
            const menuItemId = item.menuItem?._id || item.menuItem || item._id;
            const itemRestaurantId = item.restaurantId || currentRestaurantId;
            return (
              <div key={menuItemId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ flex: 1, fontSize: 13 }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => removeFromCart(menuItemId)} style={{ width: 24, height: 24, border: '1px solid #ddd', borderRadius: 6, background: 'none', cursor: 'pointer' }}>−</button>
                  <span style={{ fontSize: 13, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => addToCart({ menuItemId, name: item.name, price: item.price, restaurantId: itemRestaurantId })} style={{ width: 24, height: 24, border: '1px solid #ddd', borderRadius: 6, background: 'none', cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, minWidth: 52, textAlign: 'right' }}>₹{item.price * item.quantity}</div>
              </div>
            )
          })}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 16, borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>Total</span>
              <span style={{ fontWeight: 600 }}>₹{totalAmount}</span>
            </div>
            <button onClick={handleOrder} style={{ width: '100%', height: 42, background: '#E25E3E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Place Order →</button>
          </div>
        )}
      </div>
    </>
  )
}