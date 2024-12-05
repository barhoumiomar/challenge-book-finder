document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('search-form');
    const queryInput = document.getElementById('query');
    const bookList = document.getElementById('book-list');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 1;
    const resultsPerPage = 10;

    // Function to fetch books from the API using async/await
    async function fetchBooks(query, page) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${(page - 1) * resultsPerPage}&maxResults=${resultsPerPage}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayBooks(data.items); // Display books once the data is fetched
            updatePagination(data.totalItems); // Update pagination controls
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // Function to display books on the page
    function displayBooks(books) {
        bookList.innerHTML = ''; // Clear any previous results
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            // Extracting book details
            const title = book.volumeInfo.title || 'No Title';
            const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
            const description = book.volumeInfo.description || 'No description available.';
            const coverImage = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';

            bookItem.innerHTML = `
                <img src="${coverImage}" alt="${title}">
                <h3>${title}</h3>
                <p>Author: ${author}</p>
                <p>${description}</p>
            `;

            bookList.appendChild(bookItem);
        });
    }

    // Function to update pagination controls
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / resultsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // Event listener for search form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = queryInput.value.trim();
        if (query) {
            fetchBooks(query, currentPage); // Fetch books when the form is submitted
        }
    });

    // Event listener for next page button
    nextPageBtn.addEventListener('click', function() {
        currentPage++;
        const query = queryInput.value.trim();
        fetchBooks(query, currentPage); // Fetch books for the next page
    });

    // Event listener for previous page button
    prevPageBtn.addEventListener('click', function() {
        currentPage--;
        const query = queryInput.value.trim();
        fetchBooks(query, currentPage); // Fetch books for the previous page
    });
});
