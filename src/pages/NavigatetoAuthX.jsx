import { useEffect } from "react";
import Loader from "../helpers/Loader";

export default function NavigatetoAuthX() {
  useEffect(() => {
    // build full redirect URL first
    const fullRedirectUrl = `${import.meta.env.VITE_REDIRECT_URL}/auth-callback`;

    // then encode it
    const redirectUri = encodeURIComponent(fullRedirectUrl);

    // domain should be just the hostname, not full https://
    const domain = new URL(import.meta.env.VITE_DOMAIN).hostname;

    const authXUrl = `${import.meta.env.VITE_AUTHX_URL}?redirect_uri=${redirectUri}&domain=${domain}`;
    window.location.href = authXUrl;
  }, []);

  return <Loader />;
}
