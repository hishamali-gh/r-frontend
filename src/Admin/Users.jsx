import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3001/user')
                const filtered = res.data.filter(u => u.role === 'user')
                setUsers(filtered)
            } catch (err) {
                console.error('Failed to fetch users:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const handleToggleBlock = async (id, isBlock) => {
        try {
            await axios.patch(`http://localhost:3001/user/${id}`, { isBlock: !isBlock })
            setUsers(prev =>
                prev.map(u =>
                    u.id === id ? { ...u, isBlock: !isBlock } : u
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
                        <th className="py-3 px-5 text-right w-[20%]">Block</th>
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
                                    className={`${u.isBlock
                                        ? 'text-red-500'
                                        : 'text-green-600'
                                        } font-medium`}
                                >
                                    {u.isBlock ? 'Blocked' : 'Active'}
                                </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                                <button
                                    onClick={() => handleToggleBlock(u.id, u.isBlock)}
                                    className={`text-sm px-2 py-1 cursor-pointer transition ${u.isBlock
                                        ? 'text-green-700 hover:text-green-500'
                                        : 'text-red-700 hover:text-red-500'
                                        }`}
                                >
                                    {u.isBlock ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
