import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Benefits from "../components/Benifits";
import Categories from "../components/Categories";
import BestSellers from "../components/BestSellers";
import QuoteBanner from "../components/QuoteBanner";
import Footer from "../components/Footer";

export default function Home({ cartCount, onCartClick, onAdd }) {
  return (
    <>
      <TopBar />
      <Header
        cartCount={cartCount}
        onCartClick={onCartClick}
      />
      <Navbar />

      <main>
        <Hero />
        <Benefits />
        <Categories />
        <BestSellers onAdd={onAdd} />
        <QuoteBanner />
      </main>

      <Footer />
    </>
  );
}
