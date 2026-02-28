import { useState, useEffect } from 'react'
import API from '../api'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await API.get('acc/users/')
            const filtered = res.data.filter(u => !u.is_superuser)
            setUsers(filtered)
        } catch (err) {
            console.error('Failed to fetch users:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleBlock = async (id, isActive) => {
        try {
            await API.patch(`acc/users/${id}/`, {
                is_active: !isActive
            })

            setUsers(prev =>
                prev.map(u =>
                    u.id === id ? { ...u, is_active: !isActive } : u
                )
            )
        } catch (err) {
            console.error('Failed to update block status:', err)
        }
    }

    if (loading) return <p>Loading users...</p>

    return (
        <div>
            <h1
                className="text-6xl mb-10"
                style={{ fontFamily: "Playfair Display" }}
            >
                Users
            </h1>

            <table
                className="w-full text-gray-800 border-collapse"
                style={{ fontFamily: "SUSE Mono" }}
            >
                <thead>
                    <tr className="border-b border-gray-200 text-gray-600 text-sm uppercase">
                        <th className="py-3 px-3 text-left w-[25%]">Name</th>
                        <th className="py-3 px-6 text-center w-[30%]">Email</th>
                        <th className="py-3 px-6 text-center w-[25%]">Status</th>
                        <th className="py-3 px-5 text-right w-[20%]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr
                            key={u.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td className="py-3 px-3 text-left">{u.name}</td>
                            <td className="py-3 px-6 text-center text-gray-600">{u.email}</td>

                            <td className="py-3 px-6 text-center">
                                <span
                                    className={`${
                                        !u.is_active
                                            ? 'text-red-500'
                                            : 'text-green-600'
                                    } font-medium`}
                                >
                                    {!u.is_active ? 'Blocked' : 'Active'}
                                </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                                <button
                                    onClick={() => handleToggleBlock(u.id, u.is_active)}
                                    className={`text-sm px-2 py-1 cursor-pointer transition ${
                                        !u.is_active
                                            ? 'text-green-700 hover:text-green-500'
                                            : 'text-red-700 hover:text-red-500'
                                    }`}
                                >
                                    {!u.is_active ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}