import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import ContactContent from "./ContactContent";

export default function ContactPage() {
  return (
    <>
      <Navbar pastHero={true} />
      <ContactContent />
      <Footer />
    </>
  );
}