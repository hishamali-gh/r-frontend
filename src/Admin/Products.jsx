import { useState, useEffect } from 'react'
import API from '../api'

export default function Products() {

    const [newProduct, setNewProduct] = useState({
        category: '',
        product_type: '',
        name: '',
        description: '',
        price: ''
    })

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

    const refreshImageProduct = async (productId) => {
        const res = await API.get('products/products/')
        setProducts(res.data)
        const updated = res.data.find(p => p.id === productId)
        setImageProduct(updated)
    }

    const handleAddImage = async (productId) => {
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

    const handleSetMain = async (productId, imageId) => {
        await API.patch(`products/products/${productId}/images/${imageId}/`, {
            main: true
        })
        refreshImageProduct(productId)
    }

    const handleEditImage = async (productId, imageId) => {
        await API.patch(`products/products/${productId}/images/${imageId}/`, {
            url: editingUrl
        })
        setEditingImageId(null)
        refreshImageProduct(productId)
    }

    return (
        <div>

            <h1 className="text-6xl mb-10" style={{ fontFamily: 'Playfair Display' }}>
                Products
            </h1>

            <table className="w-full text-gray-800 border-collapse" style={{ fontFamily: 'SUSE Mono' }}>
                <thead>
                    <tr className="border-b border-gray-200 text-gray-600 text-sm uppercase">
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-6">Category</th>
                        <th className="py-3 px-6">Type</th>
                        <th className="py-3 px-6">Price</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-3 px-3">{p.name}</td>
                            <td className="py-3 px-6">{p.category}</td>
                            <td className="py-3 px-6">{p.product_type}</td>
                            <td className="py-3 px-6">{p.price}</td>

                            <td className="cursor-pointer text-sm"
                                onClick={() => setImageProduct(p)}>
                                Images
                            </td>

                            <td className="cursor-pointer"
                                onClick={() => setEditProduct(p)}>
                                ⩔
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* IMAGE MANAGER */}

            {imageProduct && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40"></div>

                    <div className="fixed inset-0 flex justify-center items-start pt-20 z-50">
                        <div className="bg-white w-full max-w-lg p-6 shadow-lg relative">

                            <button className="absolute top-4 right-4"
                                onClick={() => setImageProduct(null)}>✕</button>

                            <h2 className="text-2xl mb-6"
                                style={{ fontFamily: 'Playfair Display' }}>
                                Images
                            </h2>

                            <div className="space-y-4 mb-6">

                                {imageProduct.images?.map(img => (
                                    <div key={img.id} className="flex items-center gap-4">

                                        <img src={img.url}
                                            className="w-16 h-16 object-cover border"/>

                                        {editingImageId === img.id ? (
                                            <>
                                                <input
                                                    value={editingUrl}
                                                    onChange={(e)=>setEditingUrl(e.target.value)}
                                                    className="border-b"
                                                />
                                                <button
                                                    onClick={()=>handleEditImage(imageProduct.id,img.id)}>
                                                    Save
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm break-all">{img.url}</span>

                                                <button
                                                    onClick={()=>{
                                                        setEditingImageId(img.id)
                                                        setEditingUrl(img.url)
                                                    }}>
                                                    Edit
                                                </button>
                                            </>
                                        )}

                                        {!img.main && (
                                            <button
                                                onClick={()=>handleSetMain(imageProduct.id,img.id)}>
                                                Set Main
                                            </button>
                                        )}

                                        <button
                                            onClick={()=>handleDeleteImage(imageProduct.id,img.id)}>
                                            Delete
                                        </button>

                                        {img.main && (
                                            <span className="text-xs text-green-600">Main</span>
                                        )}

                                    </div>
                                ))}

                            </div>

                            <input
                                placeholder="New image URL"
                                value={newImageUrl}
                                onChange={(e)=>setNewImageUrl(e.target.value)}
                                className="w-full border-b"
                            />

                            <button
                                className="mt-4 w-full border-b"
                                onClick={()=>handleAddImage(imageProduct.id)}>
                                Add Image
                            </button>

                        </div>
                    </div>
                </>
            )}

        </div>
    )
}