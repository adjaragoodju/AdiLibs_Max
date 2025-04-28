// src/components/layout/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AppLayout = ({
  uniqueGenres,
  uniqueAuthors,
  mobileMenuOpen,
  toggleMobileMenu,
  searchQuery,
  setSearchQuery,
  handleSearch,
  scrollToSection,
  homeRef,
  genresRef,
  authorsRef,
  reviewsRef,
  aboutRef,
  faqsRef,
  setShowFavoritesModal,
  hoveredNavItem,
  setHoveredNavItem,
  selectedGenre,
  setSelectedGenre,
  selectedAuthor,
  setSelectedAuthor,
}) => {
  return (
    <>
      <Header
        uniqueGenres={uniqueGenres}
        uniqueAuthors={uniqueAuthors}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        genresRef={genresRef}
        authorsRef={authorsRef}
        reviewsRef={reviewsRef}
        aboutRef={aboutRef}
        setShowFavoritesModal={setShowFavoritesModal}
        hoveredNavItem={hoveredNavItem}
        setHoveredNavItem={setHoveredNavItem}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedAuthor={selectedAuthor}
        setSelectedAuthor={setSelectedAuthor}
      />
      <main className='pt-24'>
        <Outlet />
      </main>
      <Footer
        uniqueGenres={uniqueGenres}
        scrollToSection={scrollToSection}
        genresRef={genresRef}
        aboutRef={aboutRef}
        faqsRef={faqsRef}
        setSelectedGenre={setSelectedGenre}
      />
    </>
  );
};

export default AppLayout;
