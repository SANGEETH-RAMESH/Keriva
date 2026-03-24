


import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import GatewayContent from "./GatewayContent";



const GatewayPage = () => {
  return (
    <>
      <Navbar pastHero={true} />
      <GatewayContent />
      <Footer />
    </>
  );
};


export default GatewayPage;