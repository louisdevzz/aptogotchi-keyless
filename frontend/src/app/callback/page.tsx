"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getLocalEphemeralKeyPair } from "@/hooks/useEphemeralKeyPair";
import { useRouter } from "next/navigation";
import {
  Aptos,
  AptosConfig,
  Network,
  EphemeralKeyPair,
} from "@aptos-labs/ts-sdk";

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url);
  const fragment = urlObject.hash.substring(1);
  const params = new URLSearchParams(fragment);
  return params.get("id_token");
};

function CallbackPage() {
  const [progress, setProgress] = useState<number>(0);
  const { push } = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return currentProgress + 1;
      });
    }, 30);

    async function deriveAccount() {
      const jwt = parseJWTFromURL(window.location.href);
      console.log("JWT: ", jwt);
      if (!jwt) {
        console.error("No JWT found in URL");
        return;
      }

      const payload = jwtDecode<{ nonce: string }>(jwt);
      console.log("JWT Payload: ", payload);

      const jwtNonce = payload.nonce;
      console.log("JWT Nonce: ", jwtNonce);

      const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce);
      console.log("Ephemeral Key Pair: ", ephemeralKeyPair);
      if (!ephemeralKeyPair) {
        console.error("No ephemeral key pair found for the given nonce");
        return;
      }

      await createKeylessAccount(jwt, ephemeralKeyPair);
      clearInterval(interval);
      setProgress(100);
    }

    deriveAccount();
  }, []);

  const createKeylessAccount = async (
    jwt: string,
    ephemeralKeyPair: EphemeralKeyPair
  ) => {
    const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET })); // Only devnet supported as of now (April 2024).
    const keylessAccount = await aptos.deriveKeylessAccount({
      jwt,
      ephemeralKeyPair,
    });

    console.log("Keyless Account: ", keylessAccount);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="nes-container is-rounded shadow-md cursor-not-allowed bg-gray-200">
        <h1>Redirecting...</h1>
        <br />
        <progress
          className="nes-progress is-primary"
          value={progress}
          max="100"
        ></progress>
      </div>
    </div>
  );
}

export default CallbackPage;
