
function Category({category}) {

    return(
        <div className='Admin_page overflow-y-scroll d-flex justify-content-center align-items-center'>
            <table>
                <thead>
                    <tr>
                    <th>
                        categoryId
                    </th>
                    <th>
                        name
                    </th>
                    <th>
                        Action
                    </th>
                    </tr>
            </thead>
            <tbody>
                {category.map(categoryItem => (
                    <tr key={categoryItem._id}>
                        <td><input type="text" disabled value={categoryItem.categoryId}/></td>
                        <td><input type="text" disabled value={categoryItem.name}/></td>
                        <td><button style={{backgroundColor:'#FFF700'}}>Edit</button><button className="text-white bg-danger">Delete</button></td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}

export default Category;