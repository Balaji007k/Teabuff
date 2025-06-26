import { useOutletContext } from 'react-router-dom';

function Users() {

    const users = useOutletContext();

    return(
        <div className="Admin_page">
            <table>
                <tr>
                    <th>
                        UserId
                    </th>
                    <th>
                        Username
                    </th>
                    <th>
                        Email
                    </th>
                    <th>
                        Password
                    </th>
                    <th>
                        PhoneNumber
                    </th>
                </tr>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>
                            {user._id}
                        </td>
                        <td>
                            {user.username}
                        </td>
                        <td>
                            {user.email}
                        </td>
                        <td>
                            {user.password}
                        </td>
                        <td>
                            {user.phoneNumber}
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default Users;