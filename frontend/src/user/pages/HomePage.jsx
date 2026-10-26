import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benifits";
import Categories from "../components/cardCategories";
function HomePage() {
    return <>
        <Header/>
        <main>
            <Hero/>
            <Benefits/>
            <Categories/>
        </main>
    </>
}
export default HomePage;