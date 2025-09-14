import { useEffect, useState } from "react";
import ApiService from "../../components/Service/ApiService/product-api";

function Products({ productsItem }) {
  const [SearchedProduct, setSearchedProduct] = useState([]);
  const [Search, setSearch] = useState("");
  const [Edit, setEdit] = useState(null);
  const [AddState, setAddState] = useState(false);

  // Form states
  const [form, setForm] = useState({
    categoryId: "",
    title: "",
    price: "",
    rating: "",
    description: "",
    url: "",
    ingredients: "",
    features: "",
    purchaseLink: "",
  });

  const [addForm, setAddForm] = useState({
    categoryId: "",
    title: "",
    price: "",
    rating: "",
    description: "",
    url: "",
    ingredients: "",
    features: "",
    purchaseLink: "",
  });

  const fields = [
  "categoryId",
  "title",
  "price",
  "rating",
  "description",
  "url",
  "ingredients",
  "features",
  "purchaseLink",
];


  useEffect(() => {
    setSearchedProduct(productsItem);
  }, [productsItem]);

  const handleSearch = (value) => {
    setSearch(value);
    if (!value) return setSearchedProduct(productsItem);

    const filtered = productsItem.filter(
      (product) =>
        product.title
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(value.toLowerCase().replace(/\s+/g, "")) ||
        product._id.toLowerCase().includes(value.toLowerCase())
    );
    setSearchedProduct(filtered);
  };

  const handleChange = (e, isAdd = false) => {
    const { name, value } = e.target;
    if (isAdd) {
      setAddForm({ ...addForm, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addProduct = async () => {
    const { Result, Error } = await ApiService.fetchData(
      `/product`,
      "POST",
      addForm
    );
    if (!Error) window.location.reload();
    else console.error(Error);
  };

  const updateProduct = async (id) => {
    const { Result, Error } = await ApiService.fetchData(
      `/product/${id}`,
      "PUT",
      form
    );
    if (!Error) window.location.reload();
    else console.error(Error);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Confirm Delete")) return;
    const { Result, Error } = await ApiService.fetchData(
      `/product/${id}`,
      "DELETE"
    );
    if (!Error) window.location.reload();
    else console.error(Error);
  };

  return (
    <div className="Admin_page overflow-y-scroll d-flex justify-content-start align-items-start">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-success">
          <tr>
            <th>Search</th>
            <td colSpan="10">
              <input
                type="text"
                className="form-control"
                placeholder="🔎 Product Id or Title"
                value={Search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>ProductId</th>
            <th>CategoryId</th>
            <th>Title</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Description</th>
            <th>URL</th>
            <th>Ingredients</th>
            <th>Features</th>
            <th>PurchaseLink</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Add row */}
<tr>
  <td>New</td>
  {fields.map((key) => (
    <td key={key}>
      <input
        type="text"
        name={key}
        disabled={!AddState}
        className="form-control"
        value={addForm[key]}
        onChange={(e) => handleChange(e, true)}
      />
    </td>
  ))}
  <td>
    {AddState ? (
      <>
        <button className="btn btn-success btn-sm me-1" onClick={addProduct}>
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

{/* Products list */}
{SearchedProduct?.map((item) => (
  <tr key={item._id}>
    <td>{item._id}</td>
    {fields.map((key) => (
      <td key={key}>
        <input
          type="text"
          name={key}
          className="form-control"
          disabled={Edit?._id !== item._id}
          value={Edit?._id === item._id ? form[key] : item[key] || ""}
          onChange={handleChange}
        />
      </td>
    ))}
    <td>
      {Edit?._id === item._id ? (
        <>
          <button
            className="btn btn-success btn-sm me-1"
            onClick={() => updateProduct(item._id)}
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
            onClick={() => deleteProduct(item._id)}
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
  );
}

export default Products;
