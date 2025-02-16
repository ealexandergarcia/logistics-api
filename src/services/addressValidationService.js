export const validateAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  };