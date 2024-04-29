"use client";

import GoogleLogo from "../GoogleLogo";
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair";

const buttonStyles = "nes-btn flex items-center justify-center gap-2 py-4";

export default function WalletButtons() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not set");
  }

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
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs (single-page applications) as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  // if (connected) {
  //   return (
  //     <div className="flex flex-row">
  //       <div
  //         className={cn(buttonStyles, "hover:bg-blue-700 btn-small")}
  //         onClick={disconnect}
  //       >
  //         Logout
  //       </div>
  //     </div>
  //   );
  // }

  // if (isLoading) {
  //   return (
  //     <div className={cn(buttonStyles, "opacity-50 cursor-not-allowed")}>
  //       Loading...
  //     </div>
  //   );
  // }

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
