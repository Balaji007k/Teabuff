// import { useOutletContext } from "react-router-dom";
// import "../assets_Admin/AdminPages.css";

// function productStocks() {
//   const {productStocks} = useOutletContext();

//   return (
//     <div className="Admin_page p-3">
//       <div className="table-responsive">
//         <table className="table table-bordered table-striped table-hover align-middle text-center">
//           <thead className="table-success">
//             <tr>
//               <th>Product Id</th>
//               <th>Product Name</th>
//               <th>Stocks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {productStocks.map((ProductStock) => (
//               <tr key={ProductStock._id}>
//                 <td>{ProductStock._id}</td>
//                 <td>{ProductStock.productName}</td>
//                 <td>{ProductStock.Stock}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default productStocks;

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ApiService from "../../components/Service/ApiService/product-api";
import "../assets_Admin/AdminPages.css";

export default function ProductStocks() {
  const { productStocks } = useOutletContext();

  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [edit, setEdit] = useState(null);
  const [addState, setAddState] = useState(false);
  const [form, setForm] = useState({ ProductId: "", productName: "", Stock: "" });
  const [addForm, setAddForm] = useState({ ProductId: "", productName: "", Stock: "" });

  useEffect(() => {
    setStocks(productStocks || []);
    setFilteredStocks(productStocks || []);
  }, [productStocks]);

  // 🔍 Handle search
  const handleSearch = (value) => {
    setSearch(value);
    if (!value) return setFilteredStocks(stocks);

    const filtered = stocks.filter(
      (item) =>
        item.ProductId.toLowerCase().includes(value.toLowerCase()) ||
        item.productName.toLowerCase().includes(value.toLowerCase()) ||
        item.Stock == value
    );
    setFilteredStocks(filtered);
  };

  // 🧾 Handle form change
  const handleChange = (e, isAdd = false) => {
    const { name, value } = e.target;
    if (isAdd) {
      setAddForm({ ...addForm, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ➕ Add new stock entry
  const addStock = async () => {
    const { Result, Error } = await ApiService.fetchData(
      `/productStock`,
      "POST",
      addForm
    );
    if (!Error) window.location.reload();
    else console.error(Error);
  };

  // ✏️ Update existing stock
  const updateStock = async (id) => {
    const { Result, Error } = await ApiService.fetchData(
      `/productStock/${id}`,
      "PUT",
      form
    );
    if (!Error) window.location.reload();
    else console.error(Error);
  };

  // ❌ Delete a single stock entry
  const deleteStock = async (id) => {
    if (!window.confirm("Confirm Delete")) return;
    const { Result, Error } = await ApiService.fetchData(
      `/productStock/${id}`,
      "DELETE"
    );
    if (Result) window.location.reload();
    else console.error(Error);
  };

  // ⚠️ Delete all stock entries
  const deleteAllStocks = async () => {
    if (!window.confirm("Confirm Delete All Stocks")) return;
    const { Result, Error } = await ApiService.fetchData(`/productStocks`, "DELETE");
    if (Result) window.location.reload();
    else console.error(Error);
  };

  return (
    <div className="Admin_page p-3">
      <h2 className="mb-4 text-center">🧾 Product Stock Management</h2>

      {/* 🔍 Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔎 Search Product ID or Name or Stock"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle text-center">
          <thead className="table-success">
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new stock row */}
            <tr>
              <td>
                <input
                  type="text"
                  name="ProductId"
                  className="form-control"
                  disabled={!addState}
                  value={addForm.ProductId}
                  onChange={(e) => handleChange(e, true)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="productName"
                  className="form-control"
                  disabled={!addState}
                  value={addForm.productName}
                  onChange={(e) => handleChange(e, true)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="Stock"
                  className="form-control"
                  disabled={!addState}
                  value={addForm.Stock}
                  onChange={(e) => handleChange(e, true)}
                />
              </td>
              <td>
                {addState ? (
                  <>
                    <button className="btn btn-success btn-sm me-1" onClick={addStock}>
                      Add
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setAddState(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setAddState(true)}
                  >
                    + New
                  </button>
                )}
              </td>
            </tr>

            {/* Existing stock list */}
            {filteredStocks.map((item) => (
              <tr key={item._id}>
                <td>{item.ProductId}</td>
                <td>{item.productName}</td>
                <td>
                  <input
                    type="number"
                    name="Stock"
                    className="form-control"
                    disabled={edit?._id !== item._id}
                    value={edit?._id === item._id ? form.Stock : item.Stock}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  {edit?._id === item._id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() => updateStock(item._id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEdit(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => {
                          setEdit(item);
                          setForm(item);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteStock(item._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-danger mt-3"
        style={{ width: "fit-content" }}
        onClick={deleteAllStocks}
      >
        Delete All Stocks
      </button>
    </div>
  );
}
