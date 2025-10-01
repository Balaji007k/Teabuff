import { useEffect, useState } from "react";
import ApiService from "../../components/Service/ApiService/product-api";
import { useTheme } from "../../ThemeContext";

function Products({ productsItem }) {
  const [SearchedProduct, setSearchedProduct] = useState([]);
  const [Search, setSearch] = useState("");
  const [Edit, setEdit] = useState(null);
  const [AddState, setAddState] = useState(false);


  //test
   const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file) return setMessage("Please select a JSON file.");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { Result, Error } = await ApiService.fetchData(
      "/api/import-products",
      "POST",
      formData
    );

    if (Error) {
      setMessage("Error: " + Error);
    } else {
      setMessage(`${Result.importedCount} products imported!`);
      window.location.reload();
    }
  } catch (err) {
    setMessage("Error: " + err.message);
  }
};

//test


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
    if (Result) {
      setTimeout(()=>{
      window.location.reload();
      },0);
    }
    else console.error(Error);
  };

  const deleteProductAll = async () => {
    if (!window.confirm("Confirm DeleteAll Products")) return;
    const { Result, Error } = await ApiService.fetchData(
      `/products`,
      "DELETE"
    );
    if (Result) {
      window.location.reload();
    }
    else console.error(Error);
  };

  return (
    <div className=" d-flex flex-column">

    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin - Import Products</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-green-600 text-black rounded"
      >
        Import Products
      </button>
      {message && <p className="mt-2">{message}</p>}

      <h3 className="mt-6 font-bold">Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.title} - ₹{p.price} - ⭐ {p.rating}
          </li>
        ))}
      </ul>
    </div>


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
            <th>Product Name</th>
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
<button className="ml-2 px-4 py-2 bg-green-600 text-black rounded ms-2" style={{width:'fit-content'}} onClick={()=>{deleteProductAll()}}>DeleteAll</button>
    </div>
  );
}

export default Products;
