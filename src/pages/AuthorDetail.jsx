// src/pages/AuthorDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AuthorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Only destructure what you need
  const { getBooksByFilter } = useBooks();
  const [author, setAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);

  useEffect(() => {
    // Mock author data - this would come from API later
    const decodedName = decodeURIComponent(id);

    // Find books by this author
    const authorBooks = getBooksByFilter('author', decodedName);

    if (authorBooks.length > 0) {
      // Construct author object from available data
      // In real implementation, this would come from API
      setAuthor({
        name: decodedName,
        image: `/authors/${decodedName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        genre: authorBooks[0].genre, // Using genre of first book
        description: `${decodedName} is a renowned author known for works in the ${authorBooks[0].genre} genre.`,
      });
      setAuthorBooks(authorBooks);
    }
  }, [id, getBooksByFilter]);

  if (!author) {
    return <div className='container mx-auto p-8 text-center'>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className='container mx-auto px-6 py-12 mt-12'>
        <button
          onClick={() => navigate(-1)}
          className='mb-4 flex items-center text-gray-600 hover:text-black'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Back
        </button>

        <div className='flex flex-col md:flex-row gap-8'>
          <div className='md:w-1/3'>
            <img
              src={author.image}
              alt={author.name}
              className='w-full h-auto rounded-lg shadow-lg'
              onError={(e) => {
                e.target.src = '/writer.jpg'; // Fallback image
              }}
            />
          </div>
          <div className='md:w-2/3'>
            <h2 className='text-3xl font-bold mb-2'>{author.name}</h2>
            <div className='mb-4'>
              <span className='text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
                {author.genre}
              </span>
            </div>

            <div className='mb-6'>
              <p className='text-gray-700 leading-relaxed'>
                {author.description}
              </p>
            </div>

            <h3 className='text-xl font-semibold mb-4'>
              Books by {author.name}
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
              {authorBooks.map((book, index) => (
                <div
                  key={index}
                  className='cursor-pointer hover:scale-105 transition-transform'
                  onClick={() =>
                    navigate(`/book/${encodeURIComponent(book.title)}`)
                  }
                >
                  <img
                    src={book.image || '/placeholder-book.jpg'}
                    alt={book.title}
                    className='w-full h-48 object-cover rounded-lg shadow-md mb-2'
                  />
                  <h4 className='font-medium text-gray-900 line-clamp-2'>
                    {book.title}
                  </h4>
                  <p className='text-sm text-gray-600'>{book.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuthorDetail;
