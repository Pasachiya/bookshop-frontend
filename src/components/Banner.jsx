import { useEffect, useState } from "react";
import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        console.log("Fetching banners...");
        // Try with explicit no-cors mode
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/banners/active-banners`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log("Banner response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Banner data received:", data);
        setBanners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="sale-banner">
      {Array.isArray(banners) && banners.length > 0 ? (
        banners.map((banner, index) => (
          <img
            key={banner._id}
            src={banner.imageUrl}
            alt={banner.title}
            className={`sale-banner-image ${index === currentBannerIndex ? "active" : ""}`}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No banners available.</p>
      )}

      <div className="banner-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentBannerIndex ? "active" : ""}`}
            onClick={() => setCurrentBannerIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;