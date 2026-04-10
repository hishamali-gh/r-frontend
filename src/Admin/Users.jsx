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
            <h1 className="text-5xl mb-16" style={{ fontFamily: "Playfair Display" }}>
                Users
            </h1>

            <table
                className="w-full table-fixed text-gray-800 border-collapse text-sm mt-4"
                style={{ fontFamily: "SUSE Mono" }}
            >
                <thead>
                    <tr className="border-b border-gray-200 text-sm uppercase text-center">
                        <th className="py-3 px-6 w-[30%]">Name</th>
                        <th className="py-3 px-6 w-[30%]">Email</th>
                        <th className="py-3 px-6 w-[20%]">Status</th>
                        <th className="py-3 px-6 w-[20%]">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(u => (
                        <tr
                            key={u.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td className="py-5 px-6 text-center text-gray-800 truncate">
                                {u.name}
                            </td>

                            <td className="py-5 px-6 text-center text-gray-500 truncate">
                                {u.email}
                            </td>

                            <td className="py-5 px-6 text-center">
                                <span
                                    className={`text-xs uppercase tracking-wide ${
                                        !u.is_active
                                            ? 'text-red-400'
                                            : 'text-green-600'
                                    }`}
                                >
                                    {!u.is_active ? 'Blocked' : 'Active'}
                                </span>
                            </td>

                            <td className="py-5 px-6 text-center">
                                <span
                                    onClick={() => handleToggleBlock(u.id, u.is_active)}
                                    className="text-xs uppercase tracking-wide cursor-pointer text-gray-500 hover:text-black transition-colors"
                                >
                                    {!u.is_active ? 'Unblock' : 'Block'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
