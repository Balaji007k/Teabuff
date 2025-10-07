import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTheme } from '../ThemeContext';

export default function PlaceOrderDetails({ isAuthenticated, cart }) {
  const small = useMediaQuery({ maxWidth: 600 });
  const {Theme} = useTheme();
  const [CartItems, setCartItems] = useState(null);

  // Compute total amount
  const Subtotal = CartItems?.items?.reduce((acc, item) => {
    const qty = item.quantity;
    return acc + qty * (item.categoryId == 1 ? item.itemPrice / 2 : item.itemPrice);
  }, 0);

  const Shipping = 10;
  const Tax = (Subtotal * 18) / 100;
  const Total = (Subtotal + Tax + Shipping)?.toFixed(2);

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  return (
    <div
      className={`d-flex gap-4 pb-4 flex-column p-3 ${Theme?'text-white':'text-black'}`}
    >
      {/* Items Section */}
      <div className="bill items-page w-100">
        <h3 className="mb-3 text-center fw-semibold">Your Order</h3>
        <table className="table table-borderless align-middle text-center ">
          <thead className="border-bottom">
            <tr className="fs-5">
              <th className="fw-bold">Item</th>
              <th className="fw-bold">Quantity</th>
              <th className="fw-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {CartItems?.items?.map((item) => (
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
                  </div>
                </td>
                <td>{item.quantity}</td>
                <td>
                  ₹
                  {(
                    item.quantity *
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
          Selected Items: {CartItems?.items?.length}
        </h4>

        {/* Promo Code */}
        <div className="d-flex w-100 justify-content-center gap-2">
          <input
            className="form-control rounded-3"
            type="text"
            placeholder="Gift or promo code"
          />
          <button className="btn btn-outline-secondary rounded-3" style={{color:'inherit'}}>Apply</button>
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
