import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductFilters({ productsItem, category, Products, id }) {

  const [value, setValue] = useState(0);
  const Location = useLocation();
  const [sort, setsort] = useState(false);
  const [SearchItem, setSearchItem] = useState("");
  const [filteredCategory, setfilteredCategory] = useState(null);


  const handleCategorySelect = async (categoryId) => {
    setValue(categoryId);

    if (productsItem.length > 0) {
      if (categoryId !== 0) {
        const filtered = await productsItem.filter(product => product.categoryId === parseInt(categoryId));
        Products(filtered);
        setfilteredCategory(filtered);
      } else {
        if (Location.pathname === '/Menu') Products(productsItem)
        else Products([])
        setfilteredCategory(0);
        setsort(false);
      }
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
      setsort(false);
        if (Location.pathname==='/Menu')Products(source);
        else{
          if(filteredCategory?.length > 0) return Products(source);
          else return Products([])
        }
        return;
      }

    setsort(value);
  };

  const handleSearch = async (Searched_item) => {
    if (productsItem.length > 0) {
      if (Searched_item !== "") {
        const filtered_Item = await productsItem.filter(product => product.title.toLowerCase().replace(/\s+/g, '').includes(Searched_item.toLowerCase().replace(/\s+/g, '')));
        Products(filtered_Item);
      } else {
        if (Location.pathname === '/Menu') return Products(productsItem)
        else return Products([])
      }
    }
  };

  useEffect(() => {
    setfilteredCategory(0);
    setSearchItem("");
    Products([]);
    if (Location.pathname === '/Menu') return Products(productsItem)
  },[id])

  return (
    <div className=' w-100 mb-4'>
      <div className='Cart-head d-flex justify-content-between align-items-center px-5'>
        <div className='Categories' style={{ width: '25%' }}>
          <select
            value={value}
            className='text-white w-100 h-100'
            onChange={(e) => handleCategorySelect(parseInt(e.target.value))}
          >
            <optgroup className='bg-black text-white'>
              <option value={0} hidden selected>Category</option>
              {category.map((e) => (
                <option key={e?.categoryId} value={e?.categoryId}>{e?.name}</option>
              ))}
              <option value={0}>Cancel</option>
            </optgroup>
          </select>
        </div>

        <div>
          <div className='search justify-content-end'>
            <div className='top d-flex align-items-center w-auto'>
              <input type='search' className='item search-tag' onKeyUp={() => handleSearch(SearchItem)} onChange={(e) => setSearchItem(e.target.value.trim().toLowerCase())} placeholder='search' />
              <button type='submit' className='search-i' onClick={() => handleSearch(SearchItem)} >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </div>


        <div className='Categories' style={{ width: '20%' }}><select className=' w-100 h-100' value={sort} onChange={(e) => handleSort(e.target.value)}>
          <optgroup className='bg-black text-white'>
            <option value={false} selected hidden>Filter</option>
            <option value={'BestSelling'}>Bestselling</option>
            <option value={'LowToHigh'}>Low to High</option>
            <option value={'HighToLow'}>High to Low</option>
            <option>New Product</option>
            <option value={'Cancel'}>Cancel</option>
          </optgroup>
        </select></div>
        <div className='Categories' style={{ width: '20%' }}><select className=' w-100 h-100'><option>Select</option></select></div>
      </div>
    </div>
  )
}
