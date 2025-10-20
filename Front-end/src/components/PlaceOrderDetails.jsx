import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTheme } from '../ThemeContext';
import ApiService from '../components/Service/ApiService/product-api'; // make sure this is imported

export default function PlaceOrderDetails({ isAuthenticated, setupdatedCart, cart }) {
  const small = useMediaQuery({ maxWidth: 600 });
  const { Theme } = useTheme();
  //const [CartItems, setCartItems] = useState(null);
  const [ProductStocks, setProductStocks] = useState([]);

  const fetchProductStock = async () => {
    const Id = cart?.items.map(product => product.productId);
    const { Result, Error } = await ApiService.fetchData('/productStocks', "POST", { productIds: Id });
    if (Result) {
      setProductStocks(Result?.productStocks);
    } else {
      console.error("Unexpected data format:", Error);
    }
  };

  // Sync stock info with cart items
  
  const CartItems = useMemo(() => {
  if (!cart || !ProductStocks || ProductStocks.length === 0) return null;

  return cart.items.map(item => {
    const stockData = ProductStocks.find(stock => stock.ProductId === item.productId);

    // Out of stock or not found in ProductStocks
    if (!stockData || stockData.Stock <= 0) {
      return { ...item, quantity: 0, itemPrice: 0, outOfStock: true };
    }

    // Reduce quantity to available stock if needed
    if (item.quantity > stockData.Stock) {
      return { ...item, quantity: stockData.Stock, outOfStock: false };
    }

    // Available as requested
    return { ...item, outOfStock: false };
  });
}, [cart, ProductStocks]);

  
  useEffect(() => {
    if (!cart) return;
    if (CartItems) setupdatedCart({ ...cart, items: CartItems });

  }, [CartItems]);

  useEffect(()=>{
    fetchProductStock();
  },[])

  // Compute totals dynamically from adjusted CartItems
  const Subtotal = CartItems&&CartItems?.reduce((acc, item) => {
    const price = item.outOfStock ? 0 : (item.categoryId == 1 ? item.itemPrice / 2 : item.itemPrice);
    return acc + item.quantity * price;
  }, 0);

  const Shipping = (CartItems&&CartItems?.length==1&&CartItems[0]?.itemPrice==0?0:10);
  const Tax = (Subtotal * 18) / 100;
  const Total = (Subtotal + Tax + Shipping)?.toFixed(2);

  return (
    <div className={`d-flex gap-4 pb-4 flex-column p-3 ${Theme ? 'text-white' : 'text-black'}`}>
      {/* Items Section */}
      <div className="bill items-page w-100">
        <h3 className="mb-3 text-center fw-semibold">Your Order</h3>
        <table className="table table-borderless align-middle text-center">
          <thead className="border-bottom">
            <tr className="fs-5">
              <th className="fw-bold">Item</th>
              <th className="fw-bold">Quantity</th>
              <th className="fw-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {CartItems&&CartItems&&CartItems?.map((item) => (
              <tr className="fs-6" key={item._id}>
                <td>
                  <div className="d-flex flex-column align-items-center">
                    <img
                      className="rounded-2 mb-2"
                      src={item.Product_Url}
                      alt={item.itemName}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <span>{item.itemName}</span>
                    {item.outOfStock && (
                      <span className="text-danger fw-semibold">Out of Stock</span>
                    )}
                  </div>
                </td>
                <td>{item.outOfStock ? 0 : item.quantity}</td>
                <td>
                  ₹
                  {(
                    item.outOfStock
                      ? 0
                      : item.quantity *
                        (item.categoryId == 1 ? item.itemPrice / 2 : item.itemPrice)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Summary Section */}
      <div className="w-100 d-flex flex-column align-items-center gap-3">
        <h4 className="fw-semibold">
          Selected Items: {CartItems&&CartItems?.length}
        </h4>

        {/* Promo Code */}
        <div className="d-flex w-100 justify-content-center gap-2">
          <input
            className="form-control rounded-3"
            type="text"
            placeholder="Gift or promo code"
          />
          <button className="btn btn-outline-secondary rounded-3" style={{ color: 'inherit' }}>Apply</button>
        </div>

        {/* Summary Table */}
        <div className="bill total-page w-100">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td className="text-end">₹{Subtotal?.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Tax (18%)</th>
                <td className="text-end">₹{Tax?.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Shipping</th>
                <td className="text-end">₹{Shipping?.toFixed(2)}</td>
              </tr>
              <tr className="border-top">
                <th className="fs-5">Grand Total</th>
                <td className="fs-4 fw-bold text-end">₹{Total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
