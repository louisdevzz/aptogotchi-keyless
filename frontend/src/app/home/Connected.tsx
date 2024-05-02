"use client";

import { useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { Mint } from "./Mint";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { usePet } from "@/context/PetContext";

const aptosClient = getAptosClient();

export function Connected() {
  const { pet, setPet } = usePet();
  const { keylessAccount } = useKeylessAccount();

  const fetchPet = useCallback(async () => {
    if (!keylessAccount?.accountAddress) return;

    const hasPet = await aptosClient.view({
      payload: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::has_aptogotchi`,
        functionArguments: [keylessAccount.accountAddress],
      },
    });

    if (hasPet) {
      let response;

      try {
        response = await aptosClient.view({
          payload: {
            function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
            functionArguments: [keylessAccount.accountAddress],
          },
        });

        const [name, birthday, energyPoints, parts] = response;
        const typedParts = parts as { body: number; ear: number; face: number };
        setPet({
          name: name as string,
          birthday: birthday as number,
          energy_points: energyPoints as number,
          parts: typedParts,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [keylessAccount?.accountAddress]);

  useEffect(() => {
    if (!keylessAccount?.accountAddress) return;

    fetchPet();
  }, [keylessAccount?.accountAddress, fetchPet]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {pet ? <Pet /> : <Mint fetchPet={fetchPet} />}
    </div>
  );
}
