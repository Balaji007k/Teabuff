import "../assets_Admin/AdminPages.css";

function Category({ category }) {
  return (
    <div className="Admin_page p-3">
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
            {category.map((categoryItem) => (
              <tr key={categoryItem._id}>
                <td>
                  <input
                    type="text"
                    disabled
                    value={categoryItem.categoryId}
                    className="form-control text-center"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    disabled
                    value={categoryItem.name}
                    className="form-control text-center"
                  />
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-warning btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
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
