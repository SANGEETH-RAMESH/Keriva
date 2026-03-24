import Footer from "../common/Footer";
import Experience from "./Experience";
import Navbar from "../common/Navbar";



const ExperiencePage = () => {
    return (
        <>
            <Navbar pastHero={true} />
            <Experience />
            <Footer />
        </>
    );
};


export default ExperiencePage;