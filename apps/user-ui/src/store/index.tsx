import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendKafkaEvent } from "../actions/trackUser";


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
        location: any,
        deviceInfo: any
    ) => void;
    removeFromCart : (
        id : string,
        user: any,
        location: any,
        deviceInfo: any
    ) => void;

    addToWishlist : (
        product : Product,
        user: any,
        location: any,
        deviceInfo: any
    ) => void;
    removeFromWishlist : (
        id : string,
        user: any,
        location: any,
        deviceInfo: any
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
                });

                // send kafka event for logge in user
                if(user?.id && location && deviceInfo) {
                    sendKafkaEvent({
                        userId: user.id,
                        productId: product?.id,
                        shopId: product?.shopId,
                        action: "add_to_cart",
                        device: deviceInfo || "Unkown Device",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                    });
                }
            },

            // remove from cart
            removeFromCart: (id, user, location, deviceInfo) => {
                // find product first 
                const removedProduct = get().cart.find((item) => item.id === id);

                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== id),
                }));

                // send kafka event for logge in user
                if(user?.id && location && deviceInfo && removedProduct) {
                    sendKafkaEvent({
                        userId: user.id,
                        productId: removedProduct?.id,
                        shopId: removedProduct?.shopId,
                        action: "remove_from_cart",
                        device: deviceInfo || "Unkown Device",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                    });
                }
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

                // send kafka event for logge in user
                if(user?.id && location && deviceInfo) {
                    sendKafkaEvent({
                        userId: user.id,
                        productId: product?.id,
                        shopId: product?.shopId,
                        action: "add_to_wishlist",
                        device: deviceInfo || "Unkown Device",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                    });
                }
            },

            // remove from wishlist
            removeFromWishlist: (id, user, location, deviceInfo) => {
                // find product first 
                const removedProduct = get().wishlist.find((item) => item.id === id)

                set((state) => ({
                    wishlist: state.wishlist.filter((item) => item.id !== id),
                }));

                // send kafka event for logge in user
                if(user?.id && location && deviceInfo && removedProduct) {
                    sendKafkaEvent({
                        userId: user.id,
                        productId: removedProduct?.id,
                        shopId: removedProduct?.shopId,
                        action: "remove_from_wishlist",
                        device: deviceInfo || "Unkown Device",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                    });
                }
            }
        }),
        { name : "store-storage" }
    )
)