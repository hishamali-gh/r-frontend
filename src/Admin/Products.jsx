import { useState, useEffect } from 'react'
import API from '../api'

export default function Products() {

    const emptyProduct = {
        category: '',
        product_type: '',
        name: '',
        description: '',
        price: '',
        image: '',
        is_active: true
    }

    const [newProduct, setNewProduct] = useState(emptyProduct)
    const [products, setProducts] = useState([])
    const [editProduct, setEditProduct] = useState(null)
    const [imageProduct, setImageProduct] = useState(null)

    const [newImageUrl, setNewImageUrl] = useState('')
    const [editingImageId, setEditingImageId] = useState(null)
    const [editingUrl, setEditingUrl] = useState('')

    const fetchProducts = async () => {
        const res = await API.get('products/products/')
        setProducts(res.data)
    }

    useEffect(() => { fetchProducts() }, [])

    const handleCreateProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.product_type) return

        const payload = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            product_type: newProduct.product_type
        }

        if (!newProduct.image.trim()) delete payload.image

        await API.post('products/products/', payload)

        setNewProduct(emptyProduct)
        fetchProducts()
    }

    const handleUpdateProduct = async () => {
        const payload = {
            ...editProduct,
            price: parseFloat(editProduct.price),
            product_type: editProduct.product_type
        }

        delete payload.image

        await API.patch(`products/products/${editProduct.id}/`, payload)

        setEditProduct(null)
        fetchProducts()
    }

    const handleDeleteProduct = async (id) => {
        await API.delete(`products/products/${id}/`)
        fetchProducts()
    }

    const toggleActive = async (product) => {
        await API.patch(`products/products/${product.id}/`, {
            is_active: !product.is_active
        })
        fetchProducts()
    }

    const refreshImageProduct = async (productId) => {
        const res = await API.get('products/products/')
        setProducts(res.data)
        const updated = res.data.find(p => p.id === productId)
        setImageProduct(updated)
    }

    const handleAddImage = async (productId) => {
        if (!newImageUrl.trim()) return

        await API.post(`products/products/${productId}/images/`, {
            url: newImageUrl,
            main: false
        })

        setNewImageUrl('')
        refreshImageProduct(productId)
    }

    const handleDeleteImage = async (productId, imageId) => {
        await API.delete(`products/products/${productId}/images/${imageId}/`)
        refreshImageProduct(productId)
    }

    const toggleImageStatus = async (productId, imageId, currentStatus) => {
        await API.patch(`products/products/${productId}/images/${imageId}/`, {
            main: !currentStatus
        })
        refreshImageProduct(productId)
    }

    const handleEditImage = async (productId, imageId, url) => {
        if (!url.trim()) return

        await API.patch(`products/products/${productId}/images/${imageId}/`, {
            url: url.trim()
        })

        setEditingImageId(null)
        setEditingUrl('')
        refreshImageProduct(productId)
    }

    return (
        <div>

            <h1 className="text-6xl mb-10" style={{ fontFamily: 'Playfair Display' }}>
                Products
            </h1>

            <table
                className="w-full text-gray-800 border-collapse"
                style={{ fontFamily: 'SUSE Mono' }}
            >
                <thead>
                    <tr className="border-b border-gray-200 text-gray-600 text-sm uppercase text-left">
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Category</th>
                        <th className="py-3 px-6">Type</th>
                        <th className="py-3 px-6">Price</th>
                        <th className="py-3 px-6 w-32 text-center">Status</th>
                        <th className="py-3 px-6"></th>
                        <th className="py-3 px-6"></th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-4 px-6">{p.name}</td>
                            <td className="py-4 px-6">{p.category}</td>
                            <td className="py-4 px-6">{p.product_type}</td>
                            <td className="py-4 px-6">{p.price}</td>

                            <td className="py-4 px-6 w-32 text-center">
                                <button
                                    onClick={() => toggleActive(p)}
                                    className={`w-20 text-xs uppercase tracking-wide transition ${
                                        p.is_active
                                            ? 'text-green-600 hover:text-green-800'
                                            : 'text-gray-400 hover:text-black'
                                    }`}
                                >
                                    {p.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </td>

                            <td
                                className="py-4 px-6 cursor-pointer text-sm text-gray-500 hover:text-black"
                                onClick={() => setImageProduct(p)}
                            >
                                Images
                            </td>

                            <td
                                className="py-4 px-6 cursor-pointer text-sm text-gray-500 hover:text-black"
                                onClick={() => setEditProduct(p)}
                            >
                                Edit
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editProduct && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-center items-start pt-24"
                    onClick={() => setEditProduct(null)}
                >
                    <div
                        className="bg-white w-full max-w-xl p-10 shadow-2xl relative"
                        style={{ fontFamily: 'SUSE Mono' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-6 right-6 text-gray-400 hover:text-black"
                            onClick={() => setEditProduct(null)}
                        >
                            ✕
                        </button>

                        <h2 className="text-3xl mb-8" style={{ fontFamily: 'Playfair Display' }}>
                            Edit Product
                        </h2>

                        <div className="space-y-6">
                            <input value={editProduct.name}
                                onChange={(e)=>setEditProduct({...editProduct, name:e.target.value})}
                                className="w-full border-b outline-none" />

                            <input value={editProduct.category}
                                onChange={(e)=>setEditProduct({...editProduct, category:e.target.value})}
                                className="w-full border-b outline-none" />

                            <input value={editProduct.product_type}
                                onChange={(e)=>setEditProduct({...editProduct, product_type:e.target.value})}
                                className="w-full border-b outline-none" />

                            <input type="number" step="0.01"
                                value={editProduct.price}
                                onChange={(e)=>setEditProduct({...editProduct, price:e.target.value})}
                                className="w-full border-b outline-none" />

                            <textarea
                                value={editProduct.description}
                                onChange={(e)=>setEditProduct({...editProduct, description:e.target.value})}
                                className="w-full border-b outline-none resize-none"
                                rows="3"
                            />
                        </div>

                        <div className="mt-10 flex justify-between items-center">
                            <button
                                className="text-xs uppercase tracking-wide text-gray-600 hover:text-black"
                                onClick={handleUpdateProduct}
                            >
                                Save Changes
                            </button>

                            <button
                                className="text-xs uppercase tracking-wide text-red-500 hover:text-red-700"
                                onClick={async () => {
                                    await handleDeleteProduct(editProduct.id)
                                    setEditProduct(null)
                                }}
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {imageProduct && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-center items-start pt-24"
                    onClick={() => setImageProduct(null)}
                >
                    <div
                        className="bg-white w-full max-w-2xl p-10 shadow-2xl relative"
                        style={{ fontFamily: 'SUSE Mono' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-6 right-6 text-gray-400 hover:text-black"
                            onClick={() => setImageProduct(null)}
                        >
                            ✕
                        </button>

                        <h2 className="text-3xl mb-10" style={{ fontFamily: 'Playfair Display' }}>
                            Image Configuration
                        </h2>

                        <div className="space-y-8 mb-12">
                            {imageProduct.images?.map(img => (
                                <div key={img.id} className="flex gap-8 items-start border-b pb-8">

                                    <img src={img.url} className="w-24 h-24 object-cover border" />

                                    <div className="flex-1">

                                        {editingImageId === img.id ? (
                                            <div className="flex gap-6 items-center">
                                                <input
                                                    value={editingUrl}
                                                    onChange={(e)=>setEditingUrl(e.target.value)}
                                                    className="flex-1 border-b outline-none"
                                                />
                                                <button
                                                    className="text-sm text-black hover:underline"
                                                    onClick={()=>handleEditImage(imageProduct.id,img.id, editingUrl)}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm break-all text-gray-700 mb-4">
                                                    {img.url}
                                                </p>

                                                <div className="flex gap-8 text-xs uppercase text-gray-500">

                                                    <button
                                                        className="hover:text-black"
                                                        onClick={()=>{
                                                            setEditingImageId(img.id)
                                                            setEditingUrl(img.url)
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className={`transition ${img.main ? 'text-green-600 font-bold' : 'hover:text-black'}`}
                                                        onClick={() => toggleImageStatus(imageProduct.id, img.id, img.main)}
                                                    >
                                                        {img.main ? 'Main' : 'Secondary'}
                                                    </button>

                                                    <button
                                                        className="hover:text-red-600"
                                                        onClick={()=>handleDeleteImage(imageProduct.id,img.id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <p className="text-xs uppercase tracking-widest text-black mb-4">
                                Add a New Image
                            </p>

                            <input
                                placeholder="Image URL"
                                value={newImageUrl}
                                onChange={(e)=>setNewImageUrl(e.target.value)}
                                className="w-full border-b outline-none"
                            />

                            <button
                                className="mt-6 text-xs uppercase tracking-wide text-gray-600 hover:text-black"
                                onClick={()=>handleAddImage(imageProduct.id)}
                            >
                                Add Image
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <div className="mt-24" style={{ fontFamily: 'SUSE Mono' }}>
                <p className="text-ss uppercase tracking-widest text-black mb-8">
                    Create New Product
                </p>

                <div className="grid grid-cols-2 gap-10">
                    <input placeholder="Name"
                        value={newProduct.name}
                        onChange={(e)=>setNewProduct({...newProduct, name:e.target.value})}
                        className="border-b outline-none" />

                    <input placeholder="Category"
                        value={newProduct.category}
                        onChange={(e)=>setNewProduct({...newProduct, category:e.target.value})}
                        className="border-b outline-none" />

                    <input placeholder="Type"
                        value={newProduct.product_type}
                        onChange={(e)=>setNewProduct({...newProduct, product_type:e.target.value})}
                        className="border-b outline-none" />

                    <input type="number" step="0.01"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e)=>setNewProduct({...newProduct, price:e.target.value})}
                        className="border-b outline-none" />

                    <input
                        placeholder="Initial Image URL (optional)"
                        value={newProduct.image}
                        onChange={(e)=>setNewProduct({...newProduct, image:e.target.value})}
                        className="col-span-2 border-b outline-none"
                    />

                    <textarea
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e)=>setNewProduct({...newProduct, description:e.target.value})}
                        className="col-span-2 border-b outline-none resize-none"
                        rows="3"
                    />
                </div>

                <button
                    className="mt-10 text-s uppercase tracking-wide text-black hover:text-black"
                    onClick={handleCreateProduct}
                >
                    Create Product
                </button>
            </div>

        </div>
    )
}