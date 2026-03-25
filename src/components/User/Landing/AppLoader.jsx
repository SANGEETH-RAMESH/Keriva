import { useState } from "react";
import AnimatedKOverlay from "./Letter";

export default function AppLoader({ children }) {
  const [showOverlay, setShowOverlay] = useState(true);
 
  return (
    <>
      {/* Real page — always mounted and rendered beneath the overlay */}
      {children}
 
      {/* Loader overlay — sits on top, wipes away after animation */}
      {showOverlay && (
        <AnimatedKOverlay onComplete={() => setShowOverlay(false)} />
      )}
    </>
  );
}
 