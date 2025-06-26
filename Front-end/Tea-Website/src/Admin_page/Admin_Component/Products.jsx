import { object } from 'framer-motion/client';
import ApiService from '../../components/Service/ApiService/product-api';
import { useEffect, useState } from "react";

function Products({ productsItem }) {
  const [SearchedProduct, setSearchedProduct] = useState([]);
  const [Search,setSearch] = useState();
  const [categoryId, setcategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [price, setprice] = useState('');
  const [rating, setrating] = useState('');
  const [description, setdescription] = useState('');
  const [url, seturl] = useState('');
  const [ingredients, setingredients] = useState('');
  const [features, setfeatures] = useState('');
  const [purchaseLink, setpurchaseLink] = useState('');
  const [AddcategoryId, setAddcategoryId] = useState('');
  const [Addtitle, setAddTitle] = useState('');
  const [Addprice, setAddprice] = useState('');
  const [Addrating, setAddrating] = useState('');
  const [Adddescription, setAdddescription] = useState('');
  const [Addurl, setAddurl] = useState('');
  const [Addingredients, setAddingredients] = useState('');
  const [Addfeatures, setAddfeatures] = useState('');
  const [AddpurchaseLink, setAddpurchaseLink] = useState('');
  const [Addstate,setAddstate] = useState(false);

  const [Edit, setEdit] = useState(null);

  const HandleSearch = async (Searched_item) => {
    if (productsItem.length > 0) {
      if (Searched_item !== "") {
        const filtered_Item = await productsItem.filter(product => product.title.toLowerCase().replace(/\s+/g,'').includes(Searched_item.toLowerCase().replace(/\s+/g,''))||product._id.trim().toLowerCase().includes(Searched_item));
        setSearchedProduct(filtered_Item);
      } else {
        setSearchedProduct(productsItem);
      }
    }
  };

  const AddProduct =async(title,price,description,url,categoryId,rating,ingredients,features,purchaseLink)=>{
    setAddstate(true);
    const AddItem = {
      title,
      price,
      description,
      url,
      categoryId,
      rating,
      ingredients,
      features,
      purchaseLink
    };

    if(Object.values(AddItem).some(item => item.value !=="")){

    const { Result, Error } = await ApiService.fetchData(`/product`,'POST',AddItem);
    if (!Error) {
      alert(Result)
      window.location.reload();
    } else {
      console.error(Error);
    }
  }
  }



  const UpdateProduct = async (id) => {
    const updateItems = {
      title,
      price,
      description,
      url,
      categoryId,
      rating,
      ingredients,
      features,
      purchaseLink
    };
    console.log(updateItems)
    const { Result, Error } = await ApiService.fetchData(`/product/${id}`,"PUT",updateItems);
    if (!Error) {
      window.location.reload();
    } else {
      console.error(Error);
    }
  };

  const DeleteProduct = async (id) => {
    const confirm = window.confirm("Confirm Delete")
    if(confirm){
    const { Result, Error } = await ApiService.fetchData(`/product/${id}`, 'DELETE');
    if (!Error) {
      window.location.reload();
    } else {
      console.error(Error);
    }
  }
  };

  useEffect(()=>{
    setSearchedProduct(productsItem);
  },[])

  return (
    <div className='Admin_page overflow-y-scroll'>
      <table>
        <thead>
          <tr>
            <th>Search</th>
            <td><input type='text' placeholder='Search Id or Title' onKeyUp={()=>HandleSearch(Search)} onChange={(e)=>setSearch(e.target.value)}/></td>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>

            </td>
            <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddcategoryId(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddTitle(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddprice(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddrating(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAdddescription(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddurl(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddingredients(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddfeatures(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={!Addstate}
                  onChange={(e) => setAddpurchaseLink(e.target.value)}
                />
              </td>
              <td><button className=' bg-success' onClick={()=>AddProduct(Addtitle,Addprice,Adddescription,Addurl,AddcategoryId,Addrating,Addingredients,Addfeatures,AddpurchaseLink)}>Add</button><button className=' bg-dark-subtle' onClick={()=>setAddstate(false)}>Cancel</button></td>
          </tr>
          {SearchedProduct.length>0&&SearchedProduct.map(item => (
            <tr key={item._id}>
              <td>
                {item._id}
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? categoryId : item.categoryId}
                  onChange={(e) => setcategoryId(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? title : item.title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? price : item.price}
                  onChange={(e) => setprice(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? rating : item.rating}
                  onChange={(e) => setrating(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? description : item.description}
                  onChange={(e) => setdescription(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? url : item.url}
                  onChange={(e) => seturl(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? ingredients : item.ingredients}
                  onChange={(e) => setingredients(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? features : item.features}
                  onChange={(e) => setfeatures(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={Edit?._id !== item._id}
                  value={Edit?._id === item._id ? purchaseLink : item.purchaseLink}
                  onChange={(e) => setpurchaseLink(e.target.value)}
                />
              </td>
              <td>
                {Edit?._id !== item._id ? (
                  <div className="d-flex">
                    <button
                      className="rounded-2" style={{backgroundColor:'#FFF700'}}
                      onClick={() => {
                        setEdit(item);
                        setcategoryId(item.categoryId);
                        setTitle(item.title);
                        setprice(item.price);
                        setrating(item.rating);
                        setdescription(item.description);
                        seturl(item.url);
                        setingredients(item.ingredients);
                        setfeatures(item.features);
                        setpurchaseLink(item.purchaseLink);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-white bg-danger"
                      onClick={() => DeleteProduct(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="d-flex">
                    <button
                      className="text-white bg-success"
                      onClick={() => UpdateProduct(item._id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-dark-subtle"
                      onClick={() => setEdit(null)}
                    >
                      Cancel
                    </button>
                  </div>
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
