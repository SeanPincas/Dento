import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { DELIVERY_FEE, MAX_ITEM_QUANTITY } from "../config";

export const StoreContext = createContext(null);

const clampQuantity = (quantity) =>
    Math.max(0, Math.min(MAX_ITEM_QUANTITY, Math.floor(Number(quantity) || 0)));

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // Shared UI state, so the navbar, bottom nav and pages can open the same
    // order slip, sign-in pop-up and search pop-up.
    const [slipOpen, setSlipOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    // A request (from the slip sheet) to scroll to a dish card in the menu.
    const [locateRequest, setLocateRequest] = useState(null);
    const requestLocate = (itemId) => setLocateRequest({ itemId, at: Date.now() });

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }));
        if (token) await api.addToCart(token, itemId);
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] ?? 0) - 1) }));
        if (token) await api.removeFromCart(token, itemId);
    };

    // Set an exact quantity (typed into a dish card), 0 to MAX_ITEM_QUANTITY.
    const setItemQuantity = async (itemId, quantity) => {
        const qty = clampQuantity(quantity);
        setCartItems((prev) => ({ ...prev, [itemId]: qty }));
        if (token) await api.setCartQuantity(token, itemId, qty);
    };

    const getTotalCartAmount = () =>
        Object.entries(cartItems ?? {}).reduce((total, [itemId, qty]) => {
            if (qty <= 0) return total;
            const item = food_list.find((product) => product._id === itemId);
            return item ? total + item.price * qty : total;
        }, 0);

    // Delivery is only charged when there is something in the cart.
    const getDeliveryFee = () => (getTotalCartAmount() === 0 ? 0 : DELIVERY_FEE);
    const getOrderTotal = () => getTotalCartAmount() + getDeliveryFee();

    // Number of plates ordered (2 Taiyaki + 1 tea = 3).
    const getCartCount = () =>
        Object.entries(cartItems ?? {}).reduce((count, [itemId, qty]) =>
            qty > 0 && food_list.some((item) => item._id === itemId) ? count + qty : count, 0);

    const signOut = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    useEffect(() => {
        async function loadData() {
            const menu = await api.listFood();
            setFoodList(menu.data ?? []);

            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                const cart = await api.getCart(savedToken);
                if (cart.success) {
                    setToken(savedToken);
                    setCartItems(cart.cartData ?? {});
                } else {
                    // Expired or invalid sign-in: drop it so the user can sign in again.
                    localStorage.removeItem("token");
                }
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        setItemQuantity,
        getTotalCartAmount,
        getDeliveryFee,
        getOrderTotal,
        getCartCount,
        slipOpen,
        setSlipOpen,
        showLogin,
        setShowLogin,
        showSearch,
        setShowSearch,
        locateRequest,
        setLocateRequest,
        requestLocate,
        token,
        setToken,
        signOut,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
