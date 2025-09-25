// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useTheme } from "../../ThemeContext";

// export default function ProductFilters({ Products, id , searchingProduct }) {

//   const {productsItem,category} = useTheme();
//   const [value, setValue] = useState(0);
//   const Location = useLocation();
//   const [sort, setsort] = useState(false);
//   const [SearchItem, setSearchItem] = useState("");
//   const [filteredCategory, setfilteredCategory] = useState(null);


//   const handleCategorySelect = async (categoryId) => {
//     setValue(categoryId);

//     if (productsItem.length > 0) {
//       if (categoryId !== 0) {
//         const filtered = await productsItem.filter(product => product.categoryId === parseInt(categoryId));
//         Products(filtered);
//         setfilteredCategory(filtered);
//       } else {
//         if (Location.pathname === '/Menu') Products(productsItem);
//         else Products([]);
//         setfilteredCategory(0);
//         setsort(false);
//       }
//     }
//   };

//   const handleSort = (value) => {
//     const source = filteredCategory?.length > 0 ? filteredCategory : productsItem;

//     if (value === 'BestSelling') {
//       const Sorted = [...source].filter(product => Number(product.rating) >= 4.7);
//       Products(Sorted);
//     } else if (value === 'LowToHigh') {
//       const Sorted = [...source].sort((a, b) => a.price - b.price);
//       Products(Sorted);
//     } else if (value === 'HighToLow') {
//       const Sorted = [...source].sort((a, b) => b.price - a.price);
//       Products(Sorted);
//     } else if (value === 'Cancel'||SearchItem!=="") {
//       setsort(false);
//         if (Location.pathname==='/Menu')Products(source);
//         else{
//           if(filteredCategory?.length > 0) return Products(source);
//           else return Products([]);
//         }
//         return;
//       }

//     setsort(value);
//   };

//   const handleSearch = async (Searched_item) => {
//     if (productsItem.length > 0) {
//       if (Searched_item !== "") {
//         const filtered_Item = await productsItem.filter(product => product.title.toLowerCase().replace(/\s+/g, '').includes(Searched_item.toLowerCase().replace(/\s+/g, '')));
//         Products(filtered_Item);
//       } else {
//         if (Location.pathname === '/Menu') return Products(productsItem);
//         else return Products([]);
//       }
//     }
//   };

//   useEffect(() => {
//     setfilteredCategory(0);
//     setSearchItem("");
//     Products([]);
//     if (Location.pathname === '/Menu') return Products(productsItem);
//   },[id,productsItem])

//   return (
//     <div className=' w-100 mb-4'>
//       <div className='Cart-head d-flex justify-content-between align-items-center px-5'>
//         <div className='Categories' style={{ width: '25%' }}>
//           <select
//             value={value}
//             className='text-white w-100 h-100'
//             onChange={(e) => handleCategorySelect(parseInt(e.target.value))}
//           >
//             <optgroup className='bg-black text-white'>
//               <option value={0} hidden defaultValue>Category</option>
//               {category.map((e) => (
//                 <option key={e?.categoryId} value={e?.categoryId}>{e?.name}</option>
//               ))}
//               <option value={0}>Cancel</option>
//             </optgroup>
//           </select>
//         </div>

//         <div>
//           <div className='search justify-content-end'>
//             <div className='top d-flex align-items-center w-auto'>
//               <input type='search' className='item search-tag' value={SearchItem} onKeyUp={() => handleSearch(SearchItem)} onChange={(e) => {setSearchItem(e.target.value.trim().toLowerCase());searchingProduct(e.target.value.trim())}} placeholder='search' />
//               <button type='submit' className='search-i' onClick={() => handleSearch(SearchItem)} >
//                 <i className="fa-solid fa-magnifying-glass"></i>
//               </button>
//             </div>
//           </div>
//         </div>


//         <div className='Categories' style={{ width: '20%' }}><select className=' w-100 h-100' value={sort} onChange={(e) => handleSort(e.target.value)}>
//           <optgroup className='bg-black text-white'>
//             <option value={false} defaultValue hidden>Filter</option>
//             <option value={'BestSelling'}>Bestselling</option>
//             <option value={'LowToHigh'}>Low to High</option>
//             <option value={'HighToLow'}>High to Low</option>
//             <option>New Product</option>
//             <option value={'Cancel'}>Cancel</option>
//           </optgroup>
//         </select></div>
//         <div className='Categories' style={{ width: '20%' }}><select className=' w-100 h-100'><option>Select</option></select></div>
//       </div>
//     </div>
//   )
// }


import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

export default function ProductFilters({ Products, id, searchingProduct }) {
  const { productsItem, category } = useTheme();
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

    if (value === 'BestSelling') {
      const Sorted = [...source].filter(product => Number(product.rating) >= 4.7);
      Products(Sorted);
    } else if (value === 'LowToHigh') {
      const Sorted = [...source].sort((a, b) => a.price - b.price);
      Products(Sorted);
    } else if (value === 'HighToLow') {
      const Sorted = [...source].sort((a, b) => b.price - a.price);
      Products(Sorted);
    } else if (value === 'Cancel') {
      setSort(false);
        if (Location.pathname==='/Menu')Products(source);
        else{
          if(filteredCategory?.length > 0) return Products(source);
          else return Products([]);
        }
        return;
      }

    setSort(value);
  };

  // 🔹 Sorting filter
  // const handleSort = (value) => {
  //   setSort(value);

  //   const source =
  //     filteredCategory?.length > 0 ? filteredCategory : productsItem;

  //   let sorted = [...source];
  //   if (value === "BestSelling") {
  //     sorted = source.filter((product) => Number(product.rating) >= 4.7);
  //   } else if (value === "LowToHigh") {
  //     sorted = source.sort((a, b) => a.price - b.price);
  //   } else if (value === "HighToLow") {
  //     sorted = source.sort((a, b) => b.price - a.price);
  //   } else if (value === "Cancel") {
  //     if (Location.pathname === "/Menu") Products(source);
  //     else Products(filteredCategory?.length > 0 ? source : []);
  //     return;
  //   }

  //   Products(sorted);
  // };

  // 🔹 Search filter
  const handleSearch = (query) => {
    if (!productsItem.length) return;

    const term = query.trim().toLowerCase().replace(/\s+/g, "");

    if (term) {
      const filtered = productsItem.filter((product) =>
        product.title.toLowerCase().replace(/\s+/g, "").includes(term)
      );
      Products(filtered);
      searchingProduct(term); // 🔹 still calling external search if needed
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
        <div className="Categories" style={{ width: "25%" }}>
          <select
            value={selectedCategory}
            className="text-white w-100 h-100"
            onChange={(e) => handleCategorySelect(Number(e.target.value))}
          >
            <optgroup className="bg-black text-white">
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
            <div className="top d-flex align-items-center w-auto">
              <input
                type="search"
                className="item search-tag"
                value={searchItem}
                onKeyUp={()=>handleSearch(searchItem)}
                onChange={(e) => setSearchItem(e.target.value)}
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
        <div className="Categories" style={{ width: "20%" }}>
          <select
            className="w-100 h-100"
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
          >
            <optgroup className="bg-black text-white">
              <option value="" hidden>
                Filter
              </option>
              <option value="BestSelling">Bestselling</option>
              <option value="LowToHigh">Low to High</option>
              <option value="HighToLow">High to Low</option>
              <option value="New">New Product</option>
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
