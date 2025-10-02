// import { useOutletContext } from "react-router-dom"

// export default function Orders(){
//     const {Orders} = useOutletContext();
//     console.log(Orders)
//     return(
//         <div>HI</div>
//     )
// }

import { useOutletContext } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export default function Orders() {
  const { Orders } = useOutletContext();  // Orders comes from parent

  if (!Orders || Orders.length === 0) {
  return <div>No orders found</div>;
}


  // --- Example Data Transformations ---
  // 1. Sales by Date (Total Revenue per Delivery Date)
  const salesByDate = Orders.map(order => ({
    date: new Date(order.deliveryDate).toLocaleDateString(),
    total: order.total,
  }));

  // 2. Product Quantity Aggregation
  const productQty = {};
Orders.forEach(order => {
  if (Array.isArray(order.products)) {   // ✅ only loop if products exist
    order.products.forEach(p => {
      if (!productQty[p.name]) productQty[p.name] = 0;
      productQty[p.name] += p.qty;
    });
  }
});


  const productData = Object.keys(productQty).map(name => ({
    name,
    qty: productQty[name],
  }));

  // 3. Payment Types Breakdown
  const paymentData = {};
  Orders.forEach(order => {
    if (!paymentData[order.paymentType]) paymentData[order.paymentType] = 0;
    paymentData[order.paymentType] += order.total;
  });

  const paymentChart = Object.keys(paymentData).map(type => ({
    name: type,
    value: paymentData[type],
  }));

  // --- Colors for Pie chart ---
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Order Analytics</h2>

      {/* Sales by Date */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Sales by Date</h3>
        <BarChart width={600} height={300} data={salesByDate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total Sales" />
        </BarChart>
      </div>

      {/* Product Quantities */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Products Ordered</h3>
        <BarChart width={600} height={300} data={productData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="qty" fill="#82ca9d" name="Quantity" />
        </BarChart>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h3 className="font-semibold mb-2">Payment Methods</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={paymentChart}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {paymentChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
