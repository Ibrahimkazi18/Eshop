import { create } from "zustand";
import { persist } from "zustand/middleware";


type Product = {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity?: number;
    shopId: string;
}

type Store = {
    cart: Product[];
    wishlist: Product[];
    addToCart : (
        product : Product,
        user: any,
        location: string,
        deviceInfo: string
    ) => void;
    removeFromCart : (
        id : string,
        user: any,
        location: string,
        deviceInfo: string
    ) => void;

    addToWishlist : (
        product : Product,
        user: any,
        location: string,
        deviceInfo: string
    ) => void;
    removeFromWishlist : (
        id : string,
        user: any,
        location: string,
        deviceInfo: string
    ) => void;
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],

            // add to cart
            addToCart: (product, user, location, deviceInfo) => {
                set((state) => {
                    const existing = state.cart?.find((item) => item.id === product.id);

                    if(existing) {
                        return {
                            cart: state.cart.map((item) => 
                                item.id === product.id 
                                    ? {...item, quantity: (item.quantity ?? 1) + 1}
                                    : item
                            ),
                        }
                    }

                    return {
                        cart: [...state.cart, {...product, quantity: 1}]
                    }
                })
            },

            // remove from cart
            removeFromCart: (id, user, location, deviceInfo) => {
                // find product first 
                const removedProduct = get().cart.find((item) => item.id === id);

                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== id),
                }))
            },

            // add to wishlist
            addToWishlist: (product, user, location, deviceInfo) => {
                set((state) => {
                    if(state.wishlist?.find((item) => item.id === product.id)) {
                        return state;
                    }

                    return {
                        wishlist: [...state.wishlist, product]
                    }
                });
            },

            // remove from wishlist
            removeFromWishlist: (id, user, location, deviceInfo) => {
                // find product first 
                const removedProduct = get().wishlist.find((item) => item.id === id)

                set((state) => ({
                    wishlist: state.wishlist.filter((item) => item.id !== id),
                }))
            }
        }),
        { name : "store-storage" }
    )
)