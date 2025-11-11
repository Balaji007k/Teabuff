import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import ApiService from "../components/Service/ApiService/product-api";
import PageNotFound from "./AssetComponents/PageNotFound";
import AlertMessage from "./AssetComponents/AlertMessage";
import LoadingPage from "./AssetComponents/LoadingPage";

export default function CheckOut({ isAuthenticated }) {
  const small = useMediaQuery({ maxWidth: 600 });
  const { Theme } = useTheme();
  const Navigate = useNavigate();
  //const { id } = useParams();
  const Location = useLocation();

  // Unified order data for both single & cart checkouts
  const orderData = Location.state;
  
  // Use the order data directly since we're using the old structure
  const orderPayload = orderData;

  const [contactEmail, setcontactEmail] = useState(isAuthenticated?.userEmail || "");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [company, setcompany] = useState("");
  const [address, setaddress] = useState("");
  const [apartment, setapartment] = useState("");
  const [city, setcity] = useState("");
  const [postcode, setpostcode] = useState("");
  const [phone, setphone] = useState("");
  const [CheckoutReUse, setCheckoutReUse] = useState(false);
  const [UserCheckOutData, setUserCheckOutData] = useState(null);
  const [AlertMessageCheckOut, setAlertMessage] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [ProductStocks, setProductStocks] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [updatedCart, setupdatedCart] = useState(null);

  // 🧠 Extract product list (handles both single + multiple)
  const productList = useMemo(() => {
    if (!orderPayload?.products) {
      console.log("No products in orderPayload:", orderPayload);
      return [];
    }
    //console.log("Products found:", orderPayload.products);
    return orderPayload.products;
  }, [orderPayload]);

  // 🧠 Fetch saved checkout address
  const fetchCheckOut = async () => {
    const { Result, Error } = await ApiService.fetchData(`/Checkouts/${isAuthenticated.userId}`);
    if (Result?.UserCheckOut) {
      setUserCheckOutData(Result.UserCheckOut.ShippingDetails[0]);
    } else {
      console.error("No UserCheckOut Data:", Error);
    }
  };

  // 🧠 Handle checkout submission
  const PostCheckOut = async (e) => {
    e.preventDefault();
    setLoading(true);

    const NewCheckout = {
      contactEmail,
      firstname,
      lastname,
      company,
      address,
      apartment,
      city,
      postcode: Number(postcode),
      phone: Number(phone),
      CheckoutReUse,
    };

    const { Result, Error } = await ApiService.fetchData(
      `/NewCheckout/${isAuthenticated.userId}`,
      "POST",
      NewCheckout
    );

    if (Result) {
      setAlertMessage({ message: Result.message, state: true });
      setTimeout(() => {
        setAlertMessage(null);
        Navigate("/Payment", {
          state: {
            updatedCart,
            NewCheckout,
          },
        });
      }, 1500);
    } else {
      console.log(Error);
      setLoading(false);
    }
  };

  // 🧠 Prefill user saved checkout info
  useEffect(() => {
    if (UserCheckOutData?.ReUseData) {
      setfirstname(UserCheckOutData.firstname || "");
      setlastname(UserCheckOutData.lastname || "");
      setcompany(UserCheckOutData.company || "");
      setaddress(UserCheckOutData.address || "");
      setapartment(UserCheckOutData.apartment || "");
      setcity(UserCheckOutData.city || "");
      setpostcode(UserCheckOutData.postcode || "");
      setphone(UserCheckOutData.phone || "");
      setCheckoutReUse(true);
    }
  }, [UserCheckOutData]);

  // ✅ Fetch product stock data
  const fetchProductStock = async () => {
    setStockLoading(true);
    try {
      if (!productList?.length) {
        setStockLoading(false);
        setLoading(false);
        return;
      }

      const productIds = productList.map((p) => p.productId);
      //console.log("Fetching stock for products:", productIds);
      
      const { Result, Error } = await ApiService.fetchData("/productStocks", "POST", { productIds });
      if (Result?.productStocks) {
        //console.log("Received stock data:", Result.productStocks);
        // Add validation to ensure each item has the correct structure
        const validatedStocks = Result.productStocks.map(stock => ({
          ProductId: stock.ProductId,
          Stock: parseInt(stock.Stock || 0)
        }));
        setProductStocks(validatedStocks);
        //console.log("Validated stock data:", validatedStocks);
      } else {
        console.error("Invalid stock data received:", { Result, Error });
        setProductStocks([]);
      }
    } catch (err) {
      console.error("Error fetching stock:", err);
      setProductStocks([]);
    } finally {
      setStockLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (orderPayload && isAuthenticated?.userId) {
      setLoading(true);
      Promise.all([fetchCheckOut(), fetchProductStock()]).then(() => {
        setLoading(false);
      });
    }
  }, [orderPayload, isAuthenticated]);

  // ✅ Merge product + stock
  const CartItems = useMemo(() => {
    if (!productList?.length) {
      console.log("No products in productList");
      return [];
    }
    
    // console.log("Processing products:", productList);
    // console.log("Available stock data:", ProductStocks);

    return productList.map((item) => {
      const productId = item.productId || item._id;
      
      // Find stock data if available
      const stockInfo = ProductStocks.find(s => s.ProductId === productId);
      
      // Validate available stock
      const availableStock = stockInfo?.Stock ?? 0;
      const requestedQty = parseInt(item.quantity) || 0;
      
      // Determine if item is out of stock
      const isOutOfStock = !stockInfo || availableStock <= 0;
      
      // Calculate final quantity based on available stock
      const finalQuantity = isOutOfStock ? 0 : Math.min(requestedQty, availableStock);
      
      // Calculate price and subtotal
      const itemPrice = parseFloat(item.itemPrice || item.price || 0);
      const subTotal = finalQuantity * itemPrice;
      
      // Log the calculations for debugging
      // console.log("Item calculations:", {
      //   name: item.itemName,
      //   id: productId,
      //   stockFound: !!stockInfo,
      //   availableStock,
      //   requestedQty,
      //   finalQty: finalQuantity,
      //   price: itemPrice,
      //   total: subTotal,
      //   isOutOfStock
      // });

      return {
        productId,
        itemName: item.itemName,
        Product_Url: item.Product_Url,
        itemPrice,
        quantity: finalQuantity,
        requestedQuantity: requestedQty,
        outOfStock: isOutOfStock,
        availableQty: availableStock,
        subTotal: subTotal || 0
      };
    });
  }, [ProductStocks, productList]);

  // Calculate all totals in one place
  const orderTotals = useMemo(() => {
    const subtotal = CartItems.reduce((a, i) => a + (i.subTotal || 0), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = (subtotal * 18) / 100;
    const total = (subtotal + tax + shipping).toFixed(2);

    return {
      subtotal,
      shipping,
      tax,
      total
    };
  }, [CartItems]);

  // ✅ Update cart summary based on stock
  useEffect(() => {
    if (!CartItems.length) {
      console.log("No cart items to process");
      setupdatedCart({
        products: [],
        subTotal: "0.00",
        Grand_Total: "0.00"
      });
      setOutOfStockItems([]);
      setLoading(false);
      return;
    }

    // Split items by stock status
    const inStock = CartItems.filter(i => !i.outOfStock && i.quantity > 0);
    const outStock = CartItems.filter(i => i.outOfStock || i.quantity <= 0);

    // console.log("Stock status:", {
    //   inStock: inStock.length,
    //   outOfStock: outStock.length
    // });

    // Calculate totals
    const calculatedSubtotal = inStock.reduce((acc, item) => {
      const itemTotal = parseFloat(item.subTotal) || 0;
      //console.log(`Item ${item.itemName}: Quantity=${item.quantity}, Price=${item.itemPrice}, Total=${itemTotal}`);
      return acc + itemTotal;
    }, 0);
    
    const newCart = {
      products: inStock,
      subTotal: calculatedSubtotal.toFixed(2),
      Grand_Total: orderTotals.total,
    };
    
    // console.log("Updating cart with:", {
    //   productCount: inStock.length,
    //   subtotal: calculatedSubtotal,
    //   grandTotal: orderTotals.total
    // });

    setupdatedCart(newCart);
    setOutOfStockItems(outStock);
    setLoading(false);
  }, [CartItems, orderTotals]);

  if (!isAuthenticated?.userId || !orderPayload || !orderPayload.products) {
    console.log("Missing required data:", { 
      isAuthenticated, 
      orderPayload
    });
    return (
      <div style={{ marginTop: "75px" }}>
        <PageNotFound Message={"Checkout Data"} />
      </div>
    );
  }

  if (Loading || stockLoading)
    return AlertMessageCheckOut?.message ? (
      <AlertMessage message={AlertMessageCheckOut} />
    ) : (
      <LoadingPage />
    );

  return (
    <div
      className={`checkout-Cart-page w-100 d-flex gap-2 ${
        !small ? "flex-row-reverse" : "flex-column"
      } ${Theme ? "text-white" : "text-black"}`}
      style={{ marginTop: !small && "70px" }}
    >
      {/* Right - Order Summary */}
      <div className="overflow-y-scroll" style={{ flex: "1 1 40%", height: "880px" ,marginTop:small&&'75px'}}>
        <div className="d-flex gap-4 pb-4 flex-column p-3">
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
                {CartItems.map((item) => (
                  <tr className="fs-6" key={item.productId}>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          className="rounded-2 mb-2"
                          src={item.Product_Url}
                          alt="product"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                        <span>{item.itemName}</span>
                        {item.outOfStock && (
                          <small className="text-danger fw-semibold">Out of Stock</small>
                        )}
                      </div>
                    </td>
                    <td>{item.outOfStock ? 0 : item.quantity > item.availableQty ? item.availableQty : item.quantity}</td>
                    <td>₹{item.subTotal?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Promo Code */}
         <div className="d-flex w-100 justify-content-center gap-2">
           <input className="form-control rounded-3" type="text" placeholder="Gift or promo code" />
           <button className="btn btn-outline-secondary rounded-3" style={{ color: "inherit" }}>
             Apply
           </button>
         </div>
          {/* Summary Section */}
          <div className="w-100 d-flex flex-column align-items-center gap-3">
            <h4 className="fw-semibold">Selected Items: {CartItems.length}</h4>
            <div className="bill total-page w-100">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th>Subtotal</th>
                    <td className="text-end">₹{orderTotals.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Tax (18%)</th>
                    <td className="text-end">₹{orderTotals.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Shipping</th>
                    <td className="text-end">₹{orderTotals.shipping.toFixed(2)}</td>
                  </tr>
                  <tr className="border-top">
                    <th className="fs-5">Grand Total</th>
                    <td className="fs-4 fw-bold text-end">₹{orderTotals.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {outOfStockItems.length > 0 && (
              <div className="alert alert-danger w-100 mt-2">
                ⚠️ {outOfStockItems.length} item(s) are out of stock and removed from order.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Left - Shipping Form */}
      <div className={`d-flex justify-content-center flex-grow-1`} style={{ flex: "1 1 60%" }}>
        <div
          className="CheckOut-Page d-flex flex-column gap-4 p-3"
          style={{ width: !small ? "80%" : "100%" }}
        >
          <h2 className="fw-bold">CheckOut</h2>
          <form onSubmit={PostCheckOut} className="d-flex flex-column gap-3">
            <div className="Contact-information w-100 d-flex flex-column gap-3">
              <h2>Contact information</h2>
              <input
                className="bg-body-secondary"
                type="email"
                value={contactEmail}
                onChange={(e) => setcontactEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={contactEmail}
              />
              <span className="d-flex align-items-center gap-2">
                <input className="check-box" type="checkbox" />
                <label style={{ color: "inherit" }}>Email me with news and offers</label>
              </span>
            </div>

            <div className="ShippingAddress w-100 d-flex flex-column gap-3">
              <h2>Shipping address</h2>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setfirstname(e.target.value)}
                    placeholder="First name"
                    required
                  />
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setlastname(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setcompany(e.target.value)}
                  placeholder="Company [Optional]"
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setapartment(e.target.value)}
                  placeholder="Apartment [Optional]"
                />
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setcity(e.target.value)}
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setpostcode(e.target.value)}
                    placeholder="Pin code"
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="Phone"
                  required
                />
                <span className="d-flex align-items-center gap-2">
                  <input
                    className="check-box"
                    checked={CheckoutReUse}
                    onChange={() => setCheckoutReUse((prev) => !prev)}
                    type="checkbox"
                  />
                  <label style={{ color: "inherit" }}>Save this information for next time</label>
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span
                  onClick={() =>
                    Navigate(
                      `/${isAuthenticated?.userName + "Cart"}/${isAuthenticated?.userId}`
                    )
                  }
                  className="d-flex align-items-center"
                  style={{ cursor: "pointer", color: "inherit" }}
                >
                  <span className="material-symbols-outlined">chevron_left</span>Return to cart
                </span>
                <button
                  type="submit"
                  className={`confirm-order-btn ${small ? "p-2" : "p-3"} ${updatedCart?.products.length<=0?'bg-secondary':'bg-success'}`}
                  disabled={updatedCart?.products.length<=0}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
