import { Body } from "./home/Body";
import { PropsWithChildren } from "react";
import WalletButtons from "@/components/WalletButtons";

const FixedSizeWrapper = ({ children }: PropsWithChildren) => {
  const fixedStyle = {
    width: "1200px",
    height: "800px",
    border: "6px solid",
    margin: "auto",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={fixedStyle}>{children}</div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex flex-col">
      <FixedSizeWrapper>
        <Header />
        <Body />
      </FixedSizeWrapper>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md w-full gap-2">
      <h1 className="text-2xl">Aptogotchi</h1>
      <WalletButtons />
    </header>
  );
}
