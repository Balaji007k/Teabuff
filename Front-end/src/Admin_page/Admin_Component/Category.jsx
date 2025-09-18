import { useState, useEffect } from "react";
import ApiService from "../../components/Service/ApiService/product-api";
import "../assets_Admin/AdminPages.css";

function Category({ category }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ categoryId: "", name: "" });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ categoryId: "", name: "" });

  // Handle edit click
  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setFormData({ categoryId: cat.categoryId, name: cat.name });
  };

  // Handle input change (for editing)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated category
  const handleSave = async (id) => {
    const { Result, Error } = await ApiService.fetchData(
      `/category/${id}`,
      "PUT",
      formData
    );

    if (!Error) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, ...formData } : cat
        )
      );
      setEditingId(null);
    } else {
      alert("Update failed: " + Error);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    const { Error } = await ApiService.fetchData(`/category/${id}`, "DELETE");

    if (!Error) {
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } else {
      alert("Delete failed: " + Error);
    }
  };

  // Add category
  const handleAdd = async () => {
    if (!newCategory.categoryId || !newCategory.name) {
      alert("Please fill in both fields!");
      return;
    }

    const { Result, Error } = await ApiService.fetchData(
      "/category",
      "POST",
      newCategory
    );

    if (!Error && Result?.category) {
      setCategories((prev) => [...prev, Result.category]);
      setNewCategory({ categoryId: "", name: "" }); // reset form
    } else {
      alert("Add failed: " + Error);
    }
  };

  useEffect(() => {
    setCategories(category || []);
  }, [category]);

  return (
    <div className="Admin_page p-3">
      {/* 🔹 Add new category form */}
      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Category ID"
          className="form-control"
          value={newCategory.categoryId}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, categoryId: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Category Name"
          className="form-control"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Category
        </button>
      </div>

      {/* 🔹 Category Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle text-center">
          <thead className="table-success">
            <tr>
              <th>Category ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((categoryItem) => (
                <tr key={categoryItem._id}>
                  <td>
                    {editingId === categoryItem._id ? (
                      <input
                        type="text"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="form-control text-center"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled
                        value={categoryItem.categoryId}
                        className="form-control text-center"
                      />
                    )}
                  </td>
                  <td>
                    {editingId === categoryItem._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control text-center"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled
                        value={categoryItem.name}
                        className="form-control text-center"
                      />
                    )}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      {editingId === categoryItem._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSave(categoryItem._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEditClick(categoryItem)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(categoryItem._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;
