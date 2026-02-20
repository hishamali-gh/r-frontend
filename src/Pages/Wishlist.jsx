import { useEffect, useState } from "react";
import API from "../api.jsx";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import "../index.css";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await API.get("/wishlist/wishlist/");
                setWishlist(response.data);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const removeFromWishlist = async (wishlistId) => {
        try {
            await API.delete(`/wishlist/wishlist/${wishlistId}/`);

            setWishlist((prev) =>
                prev.filter((item) => item.id !== wishlistId)
            );
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <p>Loading wishlist...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />

            <div className="flex-grow-1 d-flex flex-column">
                <div className="container mt-5 mb-5 flex-grow-1 d-flex flex-column">
                    <h2 className="mb-4 text-center">My Wishlist</h2>

                    {wishlist.length === 0 ? (
                        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-600 uppercase">
                                    (*￣3￣)╭
                                </p>
                                <p style={{ fontFamily: "SUSE Mono" }}>
                                    YOUR WISHLIST IS EMPTY
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {wishlist.map((item) => (
                                <div key={item.id} className="col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={item.product_details.image}
                                            className="card-img-top"
                                            alt={item.product_details.name}
                                            style={{ height: "250px", objectFit: "cover" }}
                                        />

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">
                                                {item.product_details.name}
                                            </h5>

                                            <p className="card-text">
                                                ₹{item.product_details.price}
                                            </p>

                                            <div className="mt-auto d-flex justify-content-between">
                                                <Link
                                                    to={`/products/${item.product_details.id}`}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    View
                                                </Link>

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        removeFromWishlist(item.id)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
