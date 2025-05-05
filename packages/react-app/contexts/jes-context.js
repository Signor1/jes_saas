import React, { createContext, useContext, useState, useEffect } from "react";

const APIContext = createContext();
const API_BASE_URL = "https://jes-saas.onrender.com";

export const APIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("authToken") || "";
    }
    return ""; 
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const clearError = () => setError(null);

  const apiRequest = async (endpoint, options = {}) => {
    setLoading(true);
    clearError();

    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const config = {
        ...options,
        headers,
        mode: 'cors', // Explicitly enable CORS
        credentials: 'include', // Include credentials if needed
        body: typeof options.body === "object" ? 
          JSON.stringify(options.body) : options.body,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle CORS preflight failure
      if (response.status === 0) {
        throw new Error("CORS error: Failed to connect to server");
      }

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorData = { message: `Request failed with status ${response.status}` };
        
        try {
          errorData = contentType?.includes("application/json") 
            ? await response.json()
            : { message: await response.text() };
        } catch {
          // Fall through to default error handling
        }

        throw new Error(
          errorData.message || errorData.error || JSON.stringify(errorData)
        );
      }

      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      return data || { status: response.status };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await apiRequest("/register", {
        method: "POST",
        body: userData,
      });
      
      if (response.token) {
        setToken(response.token);
      }
      return response;
    } catch (error) {
      // Specific error handling for registration
      if (error.message.includes("409")) {
        setError("User already exists");
      }
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: credentials,
      });
      
      if (response.token) {
        setToken(response.token);
      }
      return response;
    } catch (error) {
      if (error.message.includes("401")) {
        setError("Invalid credentials");
      }
      throw error;
    }
  };

  const logout = () => {
    setToken("");
    clearError();
  };

   // Create a new store
   const createStore = async (storeData) => {
    return apiRequest('/create_store', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  };

  // Get all stores
  const getStores = async () => {
    return apiRequest('/stores', {
      method: 'GET',
    });
  };

  // Update store information
  const updateStore = async (storeId, storeData) => {
    return apiRequest(`/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  };

     // add product
     const addProduct = async (storeId, productData) => {
      return apiRequest(`/stores/${storeId}/products`, {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    };

   // Get store product
   const getProducts = async (storeId) => {
    return apiRequest(`/stores/${storeId}/products`, {
      method: 'GET',
    });
  };

  const value = {
    loading,
    error,
    token,
    isAuthenticated: !!token,
    addProduct,
    getProducts,
    apiRequest,
    registerUser,
    login,
    logout,
    clearError,
    createStore,
    getStores,
    updateStore
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) throw new Error("useAPI must be used within an APIProvider");
  return context;
};