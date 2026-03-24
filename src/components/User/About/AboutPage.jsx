import Footer from "../common/Footer";
import Navbar from "../common/Navbar"; 
import About from "./About";



const AboutPage = () => {
    return (
        <>
            <Navbar pastHero={true} />
            <About />
            <Footer />
        </>
    );
};


export default AboutPage;