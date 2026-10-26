import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benifits";
import Categories from "../components/cardCategories";
import FeaturedProducts from "../components/FeaturedProducts";
function HomePage() {
    return <>
        <Header/>
        <main>
            <Hero/>
            <Benefits/>
            <Categories/>
            <FeaturedProducts/>
        </main>
    </>
}
export default HomePage;