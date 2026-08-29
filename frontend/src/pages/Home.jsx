import { useEffect, useState } from "react";
import { getTodaysMenu } from "../services/menuApi";
import MenuList from "../components/MenuList/MenuList";
import Navbar from "../components/navbar/Navbar";
import Hero from "../components/Hero/Hero";
import EmptyMenu from "../components/EmptyMenu/EmptyMenu";
import LoadingMenu from "../components/LoadingMenu/LoadingMenu";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import Footer from "../components/Footer/Footer";

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadInitialMenu = async () => {
      try {
        const data = await getTodaysMenu();
        setMenuItems((data.menuItems || []).filter((menuItem) => menuItem.available));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTodaysMenu();
      setMenuItems((data.menuItems || []).filter((menuItem) => menuItem.available));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(menuItems.map((menuItem) => menuItem.category).filter(Boolean)),
  ];
  const visibleMenuItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((menuItem) => menuItem.category === activeCategory);

  return (
    <>
      <Navbar />
      <Hero />
      <main id="today-menu">
        <section className="menu-section" aria-labelledby="today-menu-title">
          <div className="section-heading">
            <p className="eyebrow">Fresh from our kitchen</p>
            <h1 id="today-menu-title">Today&apos;s menu</h1>
            <p>
              Thoughtfully prepared Ethiopian dishes, ready to be shared at
              your table.
            </p>
          </div>

          {loading ? (
            <LoadingMenu />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchMenu} />
          ) : menuItems.length === 0 ? (
            <EmptyMenu />
          ) : (
            <>
              <div className="menu-toolbar">
                <p className="menu-count">
                  {visibleMenuItems.length} {visibleMenuItems.length === 1 ? "dish" : "dishes"}
                </p>
                <div className="category-filters" aria-label="Filter menu by category">
                  {categories.map((category) => (
                    <button
                      className={activeCategory === category ? "is-active" : ""}
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      type="button"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              {visibleMenuItems.length ? (
                <MenuList menuItems={visibleMenuItems} />
              ) : (
                <EmptyMenu message={`No ${activeCategory.toLowerCase()} dishes are available today.`} />
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
