export const setToLocalStorage = (items = {}) => {
  Object.entries(items).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

export const clearAuthFromLocalStorage = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
};

export const getFromLocalStorage = key => localStorage.getItem(key);
