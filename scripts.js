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

