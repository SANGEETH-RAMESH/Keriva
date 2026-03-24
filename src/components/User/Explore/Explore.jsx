import Footer from "../common/Footer";

import Navbar from "../common/Navbar"; 
import ExploreKerala from "./ExploreKerala";



const Explore = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar pastHero={true} />
            <main style={{ flex: 1 }}>
                <ExploreKerala />
            </main>
            <Footer />
        </div>
    );
};


export default Explore;