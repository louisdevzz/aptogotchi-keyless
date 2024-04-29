"use client";

import { AiFillSave } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { HealthBar } from "@/components/HealthBar";
import { Pet } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { useKeylessAccount } from "@/context/KeylessAccount";
import { toast } from "sonner";

export interface PetDetailsProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

const aptosClient = getAptosClient();

export function PetDetails({ pet, setPet }: PetDetailsProps) {
  const [newName, setNewName] = useState(pet.name);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);

  const { keylessAccount } = useKeylessAccount();

  const owner = keylessAccount?.accountAddress.toString() || "";

  const handleNameChange = async () => {
    if (!keylessAccount) return;

    setTransactionInProgress(true);

    const transaction = await aptosClient.transaction.build.simple({
      sender: keylessAccount.accountAddress,
      data: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
        typeArguments: [],
        functionArguments: [newName],
      },
    });

    try {
      const committedTxn = await aptosClient.signAndSubmitTransaction({
        signer: keylessAccount,
        transaction,
      });
      await aptosClient.waitForTransaction({
        transactionHash: committedTxn.hash,
      });
      toast.success(
        `Successfully renamed your pet from ${pet.name} to ${newName}!`,
        {
          action: {
            label: "Explorer",
            onClick: () =>
              window.open(
                `https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=testnet`,
                "_blank"
              ),
          },
        }
      );

      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, name: newName };
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to rename your pet. Please try again.");
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(owner);
  };

  const nameFieldComponent = (
    <div className="nes-field">
      <label htmlFor="name_field">Name</label>
      <div className="relative">
        <input
          type="text"
          id="name_field"
          className="nes-input"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-sky-500 disabled:text-gray-400"
          disabled={newName !== pet.name}
          onClick={handleNameChange}
        >
          <AiFillSave className=" h-8 w-8 drop-shadow-sm" />
        </button>
      </div>
    </div>
  );

  const ownerFieldComponent = (
    <div className="nes-field">
      <label htmlFor="owner_field">Owner</label>
      <div className="relative">
        <input
          type="text"
          id="owner_field"
          className="nes-input pr-12"
          disabled
          value={owner}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-gray-400 disabled:text-gray-400"
          onClick={handleCopy}
        >
          <FaCopy className="h-8 w-8 drop-shadow-sm" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <label>Energy Points</label>
        <HealthBar
          totalHealth={10}
          currentHealth={pet.energy_points}
          icon="star"
        />
      </div>
      <div className="flex flex-col gap-2">
        {nameFieldComponent}
        {ownerFieldComponent}
        <br />
      </div>
    </div>
  );
}
