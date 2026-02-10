import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Products() {
    const [newProduct, setNewProduct] = useState({
        id: '',
        category: '',
        type: '',
        name: '',
        description: '',
        price: '',
        count: '',
        images: ''
    })

    const [products, setProducts] = useState([])
    const [editProduct, setEditProduct] = useState(null)

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3001/products')
            const sortedProducts = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
            setProducts(sortedProducts)
        } catch (err) {
            console.error('Failed to fetch products!', err)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            const nextId = Math.max(...products.map(p => Number(p.id))) + 1

            await axios.post('http://localhost:3001/products', {
                ...newProduct,
                id: nextId.toString(),
                date: new Date()
            })

            setNewProduct({
                id: '',
                category: '',
                type: '',
                name: '',
                description: '',
                price: '',
                count: '',
                images: ''
            })

            fetchProducts()
        } catch (err) {
            console.error('Failed to add product:', err)
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3001/products/${editProduct.id}`, editProduct)
            setEditProduct(null)
            fetchProducts()
        } catch (err) {
            console.error('Failed to update product:', err)
        }
    }

    const handleRemove = async () => {
        try {
            await axios.delete(`http://localhost:3001/products/${editProduct.id}`)
            setEditProduct(null)
            fetchProducts()
        } catch (err) {
            console.error('Failed to remove product:', err)
        }
    }

    return (
        <div>
            <h1
                className="text-6xl mb-10"
                style={{ fontFamily: 'Playfair Display' }}
            >
                Products
            </h1>

            <table
                className="w-full text-gray-800 border-collapse"
                style={{ fontFamily: 'SUSE Mono' }}
            >
                <thead>
                    <tr className="border-b border-gray-200 text-gray-600 text-sm uppercase">
                        <th className="py-3 px-3 text-left w-[35%]">Name</th>
                        <th className="py-3 px-6 text-left w-[15%]">Category</th>
                        <th className="py-3 px-6 text-left w-[25%]">Type</th>
                        <th className="py-3 px-6 text-left w-[15%]">Price</th>
                        <th className="py-3 px-3 text-left w-[20%]">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr
                            key={p.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td className="py-3 px-3">{p.name}</td>
                            <td className="py-3 px-6">{p.category}</td>
                            <td className="py-3 px-6">{p.type}</td>
                            <td className="py-3 px-6">{p.price}</td>
                            <td className="py-3 px-3">{p.count}</td>
                            <td
                                className="py-3 px-3 cursor-pointer text-gray-700 hover:text-gray-900"
                                onClick={() => setEditProduct(p)}
                            >
                                ⩔
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4
                className="text-2xl mt-32 mb-6 text-gray-800"
                style={{ fontFamily: 'Playfair Display' }}
            >
                Add a new product:
            </h4>

            <form
                onSubmit={handleAddProduct}
                className="space-y-6"
                style={{ fontFamily: 'SUSE Mono' }}
            >
                <div className="grid grid-cols-2 gap-6">
                    <input
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                    />
                    <input
                        name="category"
                        value={newProduct.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                    />
                    <input
                        name="type"
                        value={newProduct.type}
                        onChange={handleChange}
                        placeholder="Type"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                    />
                    <input
                        name="price"
                        value={newProduct.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                    />
                    <input
                        name="count"
                        value={newProduct.count}
                        onChange={handleChange}
                        placeholder="Count"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                    />
                    <input
                        name="images"
                        value={newProduct.images}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition col-span-2"
                    />
                </div>

                <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                />

                <button
                    type="submit"
                    className="w-full text-gray-900 py-2 mt-4 font-semibold border-b border-gray-800 
                               hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300"
                >
                    Add Product
                </button>
            </form>

            {editProduct && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40"></div>
                    <div className="fixed inset-0 flex justify-center items-start pt-20 z-50">
                        <div className="bg-white w-full max-w-lg p-6 shadow-lg relative">
                            <button
                                className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-900 text-xl transition"
                                onClick={() => setEditProduct(null)}
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl mb-6 text-gray-800" style={{ fontFamily: 'Playfair Display' }}>
                                Edit Product
                            </h2>

                            <div className="space-y-4" style={{ fontFamily: 'SUSE Mono' }}>
                                <input
                                    name="name"
                                    value={editProduct.name}
                                    onChange={handleEditChange}
                                    placeholder="Name"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />
                                <input
                                    name="category"
                                    value={editProduct.category}
                                    onChange={handleEditChange}
                                    placeholder="Category"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />
                                <input
                                    name="type"
                                    value={editProduct.type}
                                    onChange={handleEditChange}
                                    placeholder="Type"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />
                                <input
                                    name="price"
                                    value={editProduct.price}
                                    onChange={handleEditChange}
                                    placeholder="Price"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />
                                <input
                                    name="count"
                                    value={editProduct.count}
                                    onChange={handleEditChange}
                                    placeholder="Count"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />
                                <input
                                    name="images"
                                    value={editProduct.images}
                                    onChange={handleEditChange}
                                    placeholder="Image URL"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />
                                <textarea
                                    name="description"
                                    value={editProduct.description}
                                    onChange={handleEditChange}
                                    placeholder="Description"
                                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                                />

                                <div className="flex flex-col gap-3 mt-4">
                                    <button
                                        onClick={handleUpdate}
                                        className="w-full text-gray-900 py-2 cursor-pointer font-semibold border-b border-gray-800 hover:text-white hover:bg-black transition-colors duration-300"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={handleRemove}
                                        className="w-full text-red-700 py-2 cursor-pointer font-semibold border-b border-red-700 hover:text-white hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
