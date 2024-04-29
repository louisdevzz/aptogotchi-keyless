"use client";

import GoogleLogo from "../GoogleLogo";
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair";
import { useKeylessAccount } from "@/context/KeylessAccount";
import { collapseAddress } from "@/utils/address";

const buttonStyles = "nes-btn flex items-center justify-center gap-4 py-4";

export default function WalletButtons() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not set");
  }

  const { keylessAccount, setKeylessAccount } = useKeylessAccount();
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:3000
     */
    redirect_uri:
      typeof window !== "undefined"
        ? `${window.location.origin}/callback`
        : "http://localhost:3000/callback",
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs (single-page applications) as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  const disconnect = () => {
    setKeylessAccount(null);
  };

  if (keylessAccount) {
    return (
      <div className="flex items-center justify-center px-4">
        <button className={buttonStyles} onClick={disconnect}>
          <GoogleLogo />
          {collapseAddress(keylessAccount.accountAddress.toString())}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4">
      <a href={redirectUrl.toString()} className="hover:no-underline">
        <button className={buttonStyles}>
          <GoogleLogo />
          Sign in with Google
        </button>
      </a>
    </div>
  );
}
