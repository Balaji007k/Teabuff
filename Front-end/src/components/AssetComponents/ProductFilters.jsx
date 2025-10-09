import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

export default function ProductFilters({ Products, id, searchingProduct }) {
  const { productsItem, category, Theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sort, setSort] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [filteredCategory, setFilteredCategory] = useState(null);

  const Location = useLocation();

  // 🔹 Category filter
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);

    if (!productsItem.length) return;

    if (categoryId !== 0) {
      const filtered = productsItem.filter(
        (product) => product.categoryId === categoryId
      );
      Products(filtered);
      setFilteredCategory(filtered);
    } else {
      // Cancel category filter
      if (Location.pathname === "/Menu") Products(productsItem);
      else Products([]);
      setFilteredCategory(null);
      setSort("");
    }
  };

  const handleSort = (value) => {
  const source = filteredCategory?.length > 0 ? filteredCategory : productsItem;

  let Sorted = [];

  if (value === 'BestSelling') {
    Sorted = [...source].filter(product => Number(product.rating) >= 4.7);
  } else if (value === 'LowToHigh') {
    Sorted = [...source].sort((a, b) => a.price - b.price);
  } else if (value === 'HighToLow') {
    Sorted = [...source].sort((a, b) => b.price - a.price);
  } else if (value === 'New') {
    Sorted = [...source].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (value === 'HighRating') {
    Sorted = [...source].filter(product => Number(product.rating) >= 4 && Number(product.rating) <= 5);
  } else if (value === 'LowRating') {
    Sorted = [...source].filter(product => Number(product.rating) >= 1 && Number(product.rating) < 4);
  } else if (value === 'Cancel') {
    setSort(false);
    if (Location.pathname === '/Menu') Products(source);
    else {
      if (filteredCategory?.length > 0) return Products(source);
      else return Products([]);
    }
    return;
  }

  Products(Sorted);
  setSort(value);
};



  // 🔹 Search filter
  const handleSearch = (query) => {
    if (!productsItem.length) return;

    const term = query.trim().toLowerCase().replace(/\s+/g, "");

    if (term) {
      const filtered = productsItem.filter((product) =>
        product.title.toLowerCase().replace(/\s+/g, "").includes(term)
      );
      Products(filtered);
    } else {
      if (Location.pathname === "/Menu") Products(productsItem);
      else Products([]);
    }
  };

  // 🔹 Reset on dependency change
  useEffect(() => {
    setFilteredCategory(null);
    setSearchItem("");
    setSelectedCategory(0);
    setSort("");

    if (Location.pathname === "/Menu") Products(productsItem);
    else Products([]);
  }, [id, productsItem]);

  return (
    <div className="w-100 mb-md-4">
      <div className="Cart-head d-flex justify-content-between align-items-center px-5">
        {/* Category filter */}
        <div className={`Categories ${Theme?'bg-white text-black':'bg-black text-white'}`} style={{ width: "25%" }}>
          <select
            value={selectedCategory}
            className={`w-100 h-100 ${Theme?'bg-white text-black':'bg-black text-white'}`}
            onChange={(e) => handleCategorySelect(Number(e.target.value))}
          >
            <optgroup className="">
              <option value={0} hidden>
                Category
              </option>
              {category.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.name}
                </option>
              ))}
              <option value={0}>Cancel</option>
            </optgroup>
          </select>
        </div>

        {/* Search filter */}
        <div>
          <div className="search justify-content-end">
            <div className={`top d-flex align-items-center w-auto ${Theme?'bg-white text-black':'bg-black text-white'}`}>
              <input
                type="search"
                className="item search-tag"
                value={searchItem}
                onKeyUp={()=>handleSearch(searchItem)}
                onChange={(e) => {setSearchItem(e.target.value);searchingProduct(e.target.value)}}
                placeholder="search"
              />
              <button
                type="submit"
                className="search-i-product"
                onClick={() => handleSearch(searchItem)}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sort filter */}
        <div className={`Categories ${Theme?'bg-white text-black':'bg-black text-white'}`} style={{ width: "20%" }}>
          <select
  className={`w-100 h-100 ${Theme ? 'bg-white text-black' : 'bg-black text-white'}`}
  value={sort}
  onChange={(e) => handleSort(e.target.value)}
>
  <optgroup>
    <option value="" hidden>Filter</option>
    <option value="BestSelling">Bestselling</option>
    <option value="LowToHigh">Low to High</option>
    <option value="HighToLow">High to Low</option>
    <option value="New">New Product</option>
    <option value="HighRating">Rating 4–5</option>
    <option value="LowRating">Rating 1–3</option>
    <option value="Cancel">Cancel</option>
  </optgroup>
</select>

        </div>

        {/* Placeholder for future dropdown */}
        {/* <div className="Categories" style={{ width: "20%" }}>
          <select className="w-100 h-100">
            <option>Select</option>
          </select>
        </div> */}
      </div>
    </div>
  );
}
