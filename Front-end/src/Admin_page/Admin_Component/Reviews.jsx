import { useEffect, useState } from "react";
import "../assets_Admin/AdminPages.css";

function Reviews({ AllReview }) {
  const [flattenedReviews, setFlattenedReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedReviews, setSearchedReviews] = useState([]);

  // Flatten AllReview
  useEffect(() => {
    if (AllReview?.length) {
      const allReviews = [];
      AllReview.forEach((product) => {
        const { title, comments } = product;
        comments.forEach((commentBlock) => {
          commentBlock.User.forEach((userReview) => {
            allReviews.push({
              title,
              ...userReview,
            });
          });
        });
      });
      setFlattenedReviews(allReviews);
      setSearchedReviews(allReviews);
    }
  }, [AllReview]);

  // Search
  const handleSearch = (value) => {
    setSearch(value);
    if (!value) return setSearchedReviews(flattenedReviews);
    const filtered = flattenedReviews.filter(
      (r) =>
        r.username.toLowerCase().includes(value.toLowerCase()) ||
        r._id.toLowerCase().includes(value.toLowerCase()) ||
        r.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchedReviews(filtered);
  };

  return (
    <div className="Admin_page p-3">
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle text-center">
          <thead className="table-success">
            <tr>
              <th>Search</th>
              <td colSpan="4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔎 Review Id, Title, or Username"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th style={{ minWidth: "80px" }}>Id</th>
              <th style={{ minWidth: "120px" }}>Title</th>
              <th style={{ minWidth: "120px" }}>Username</th>
              <th style={{ minWidth: "60px" }}>Rating</th>
              <th style={{ minWidth: "200px" }}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {searchedReviews.map((r) => (
              <tr key={r._id}>
                <td className="text-truncate">
                  {r._id}
                </td>
                <td className="text-truncate">
                  {r.title}
                </td>
                <td className="text-truncate">
                  {r.username}
                </td>
                <td>{r.ProductUserRating}</td>
                <td className="text-start text-truncate">
                  {r.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reviews;
