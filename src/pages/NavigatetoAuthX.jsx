import { useEffect } from "react";
import Loader from "../helpers/Loader";

export default function NavigatetoAuthX() {
  useEffect(() => {
    // Use only the base URL if that's what AuthX has registered
    const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URL);

    const domain = new URL(import.meta.env.VITE_DOMAIN).hostname;

    const authXUrl = `${import.meta.env.VITE_AUTHX_URL}?redirect_uri=${redirectUri}&domain=${domain}`;
    window.location.href = authXUrl;
  }, []);

  return <Loader />;
}
