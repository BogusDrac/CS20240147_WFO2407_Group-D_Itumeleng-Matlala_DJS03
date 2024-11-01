import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Book object ,represent a single book with its properties and methods


/**
    *  Creating a new book instance
    * @param {Object} bookData - book data from data.js
    * @param {string} bookData.id - Unique identifier for the book.
    * @param {string} bookData.title - The title of the book.
    * @param {string} bookData.author - The identifier for the book's author.
    * @param {string} bookData.image - URL of the book's cover image.
    * @param {string} bookData.description - Short description or summary of the book.
    * @param {string} bookData.published - Publication date of the book.
    * @param {string[]} bookData.genres - Array of genre identifiers for the book.
    * @returns {Object} A Book object with `ifMatches` and `previewElement` methods.
 */
const createBook = ({ id, title, author, image, description, published, genres }) => {
    /**
     * Book object with properties and methods for interacting with book data.
     * @type {Object}
     */
    const book = {
        id, 
        title,
        author,
        image,
        description,
        published: new Date(published),
        genres,

        /**
         * Determines if the book matches the given search filters based on title, author, and genre.
         * 
         * @param {Object} filters - Object with filter criteria.
         * @param {string} filters.title - Partial or full text to match in the book's title (case-insensitive).
         * @param {string} filters.author - Author identifier or 'any' to match any author.
         * @param {string} filters.genre - Genre identifier or 'any' to match any genre.
         * @returns {boolean} - Returns `true` if the book matches all filter criteria; `false` otherwise.
         */
       ifMatches(filters) {
            // Checks if the title filter is empty or if the book's title includes the filter text (case-insensitive)
            const titleMatch = !filters.title.trim() || this.title.toLowerCase().includes(filters.title.toLowerCase()) 

            // Matches any author if 'any' is selected, or checks if the book's author matches the filter
            const authorMatch = filters.author === 'any' || this.author === filters.author

            // Matches any genre if 'any' is selected, or checks if the book's genres include the filter genre
            const genreMatch = filters.genre === 'any' || this.genres.includes(filters.genre)

            // Returns true only if the book meets all filter criteria (title, author, genre)
            return titleMatch && authorMatch && genreMatch
       },

       
        /**
         * Creates and returns a DOM button element to display a preview of the book.
         * 
         * @returns {HTMLElement} - A button element containing the book's preview, including title, image, and author.
         */
       previewElement() {
            const btnElement = document.createElement('button')
            btnElement.classList = 'preview'
            btnElement.setAttribute('data-preview', this.id) // Sets a data attribute for easy identification

            // Sets inner HTML of button to display book image, title, and author
            btnElement.innerHTML = `
                <img class="preview_image" src="${this.image}" />
                <div class="preview_info">
                    <h3 class="preview__title">${this.title}</h3>
                    <div class="preview__author">${authors[this.author]}</div>
                </div>
            `
        // Returns the complete button element to be used in the DOM
        return btnElement
       }
    }
    return book // Returns the newly created Book object
}


// BookList Object for managing collection of books and methods

const createBookList = (booksData, booksPerPage) => {
    /**
     * Creates a new BookList instance
     * @param {Array} books - Array of raw book data
     * @param {number} booksPerPage - Number of books to display per page
     */
    const bookList = {
        // convert raw book data into book instances
        books: booksData.map(createBook),
        booksPerPage, // Store books per page setting
        // Initialize current page to 1
        currentPage: 1,
        // all books are matches initially
        matches: booksData.map(createBook),

        /**
         * Resets to the first page and returns the filtered matches.
         * @param {Object} filters - Search includea the title, author, or genre
         * @returns {Array<Object>} An array of books that match the specified filters
         */
        search(filters) {
            this.matches = this.books.filer(book => book.matches(filters))
            this.currentPage = 1
            return this.matches
        },

        /**
         * gets books for the current page based on 'booksPerPage'.
         * This method slices the 'matches' array to return  books for the current page
         * @returns {Array<Object>} An array of books for the current page
         */
        getCurrentBookPage() {
             // Calculate the start and end indexes for slicing 'matches'
            const start = (this.currentPage -1) * this.booksPerPage
            const end = start + this.booksPerpage
            return this.matches.slice(start, end)
        },

        /**
         * Calculates the number of books remaining after the current page
         * @returns {number} The count of remaining books after the current page
         */
        remainingCount() {
            // Calculate remaining books by subtracting books shown from total matches
            return Math.max(0, this.matches.length - (this.currentPage * this.booksPerPage))
        },

        /**
         * goes to the next page of results if additional books are available.
         * @returns {boolean} true if the page goes successfully, false if no more pages are available
         */
        nextPage() {
             // move to the next page only if there are remaining books to display
            if (this.remainingCount() > 0) {
                this.currentPage++
                return true
            }
            return false
        }
    }
    return bookList // returns the bookList object
}