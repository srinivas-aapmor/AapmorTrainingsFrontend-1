import { useEffect } from "react";
import Loader from "../helpers/Loader";

export default function NavigatetoAuthX() {
  useEffect(() => {
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
    const domain = import.meta.env.VITE_DOMAIN;
    const authXUrl = import.meta.env.VITE_AUTHX_URL;

    if (!redirectUrl || !domain || !authXUrl) {
      console.error("Missing VITE env variables for AuthX redirect!");
      return;
    }

    // Add /auth-callback to redirect URI
    const redirectUri = encodeURIComponent(`${redirectUrl}/auth-callback`);

    // Use replace() instead of href to avoid history loop
    const fullUrl = `${authXUrl}?redirect_uri=${redirectUri}&domain=${domain}`;
    window.location.replace(fullUrl);
  }, []);

  return <Loader />;
}
