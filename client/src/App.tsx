import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        savedBooks: {
          merge(existing = [], incoming: any[]) {
            // Ensure no duplicates by using bookId as the unique identifier
            const mergedBooks = [...existing, ...incoming];
            const uniqueBooks = mergedBooks.reduce((acc, book) => {
              if (!acc.some((b: { bookId: string }) => b.bookId === book.bookId)) {
                acc.push(book);
              }
              return acc;
            }, []);
            return uniqueBooks;
          },
        },
      },
    },
  },
});

const authLink = setContext((_, { headers = {} }: { headers?: Record<string, string> }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className="flex-column justify-center align-center min-100-vh bg-primary">
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;
