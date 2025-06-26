
function Reviews({ Review }) {

    return (
        <div className='Admin_page overflow-y-scroll'>
            <table>
                <tr>
                    <th>
                        Id
                    </th>
                    <th>
                        name
                    </th>
                    <th>
                        rating
                    </th>
                    <th>
                        review
                    </th>
                    <th>
                        image
                    </th>
                </tr>
                {Review.map(review => (
                    <tr key={review._id}>
                        <td>{review._id}</td>
                        <td>{review.name}</td>
                        <td>{review.rating}</td>
                        <td>{review.review}</td>
                        <td>{review.image}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default Reviews;