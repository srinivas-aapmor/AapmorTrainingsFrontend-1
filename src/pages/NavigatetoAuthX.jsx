import { useEffect } from "react";
import Loader from "../helpers/Loader";
// console.log(import.meta.env.VITE_REDIRECT_URL);
export default function NavigatetoAuthX() {
  useEffect(() => {
    const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URL) + '/auth-callback';
    const domain = import.meta.env.VITE_DOMAIN;

    const authXUrl = `${import.meta.env.VITE_AUTHX_URL
      }?redirect_uri=${redirectUri}&domain=${domain}`;
    window.location.href = authXUrl;
  }, []);

  return <Loader />;
}
