import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import JournalContent from "./JournalContent";

export default function JournalPage() {
  return (
    <>
      <Navbar pastHero={true} />
      <JournalContent />
      <Footer />
    </>
  );
}