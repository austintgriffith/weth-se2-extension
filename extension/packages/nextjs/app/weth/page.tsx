"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: wethHolderContractData } = useDeployedContractInfo("WethHolder");
  const [amount, setAmount] = useState("");

  const { data: wethAddress } = useScaffoldReadContract({
    contractName: "WethHolder",
    functionName: "WETH",
  });

  const { data: wethHolderBalance } = useScaffoldReadContract({
    contractName: "WethHolder",
    functionName: "getBalance",
  });

  const { writeContractAsync: writeWethHolderAsync } = useScaffoldWriteContract("WethHolder");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">WETH</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mt-4">
            <p className="my-2 font-medium">WETH Contract Address:</p>
            <Address address={wethAddress} />
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mt-4">
            <p className="my-2 font-medium">WethHolder Contract Address:</p>
            <Address address={wethHolderContractData?.address} />
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mt-4">
            <p className="my-2 font-medium">WethHolder Balance:</p>
            <p>{formatEther(wethHolderBalance ?? 0n)}</p>
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mt-8">
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input input-bordered"
            />
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  await writeWethHolderAsync({
                    functionName: "deposit",
                    value: parseEther(amount),
                  });
                  setAmount("");
                } catch (e) {
                  console.error("Error depositing:", e);
                }
              }}
            >
              Deposit
            </button>
            <button
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  await writeWethHolderAsync({
                    functionName: "withdraw",
                    args: [parseEther(amount)],
                  });
                  setAmount("");
                } catch (e) {
                  console.error("Error withdrawing:", e);
                }
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
