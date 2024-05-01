import { Body } from "./home/Body";
import WalletButtons from "@/components/WalletButtons";
import { useKeylessAccount } from "@/context/KeylessAccount";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="md:w-[1200px] md:h-[800px] m-auto border-4 border-black border-solid">
        <Header />
        <Body />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="md:sticky top-0 z-10 flex justify-between items-center md:px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md w-full gap-2">
      <h1 className="text-2xl hidden md:block">Aptogotchi</h1>
      <WalletButtons />
    </header>
  );
}
