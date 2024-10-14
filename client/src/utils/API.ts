export const searchGoogleBooks = async (query: string) => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const data = await response.json();
        return data.items;
    } catch (err) {
        console.error('Error fetching data from Google Books API:', err);
    }
  };