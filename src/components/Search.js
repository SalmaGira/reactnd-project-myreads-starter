import React from "react";
import * as BooksAPI from "../BooksAPI";
import "../App.css";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";

class Search extends React.Component {
  state = {
    query: "",
    booksFromSearch: null,
    booksFromShelves: null,
  };

  async updateQuery(query) {
    this.setState(() => ({
      query: query.trim(),
    }));

    let booksFromShelves = await BooksAPI.getAll();
    this.setState({ booksFromShelves: booksFromShelves });

    let booksFromSearch = await BooksAPI.search(query);

    if (!booksFromSearch || booksFromSearch.error) {
      this.setState({ booksFromSearch: null });
    } else if (Array.isArray(booksFromSearch)) {
      for (let book in booksFromSearch) {
        const shelfBook = await BooksAPI.get(booksFromSearch[book].id);
        const shelf = shelfBook.shelf;
        booksFromSearch[book].shelf = shelf;
      }

      this.setState({ booksFromSearch: booksFromSearch });
    }
  }

  async handler() {}

  render() {
    const { booksFromSearch } = this.state;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {booksFromSearch &&
              booksFromSearch.map((book) => (
                <li key={book.id}>
                  {/* {console.log(`** ${book.title} ** with id: ${book.id}`)} */}
                  {/* {console.log(BooksAPI.get(book.id))} */}
                  {/* {console.log(this.getShelf(book.id))} */}
                  <BookCard
                    key={book.id}
                    bookId={book.id}
                    activeShelf={book.shelf ? book.shelf : "none"}
                    bookTitle={book.title}
                    bookAuthor={book.authors}
                    bookImageUrl={
                      book.imageLinks &&
                      JSON.stringify(book.imageLinks.thumbnail)
                    }
                    action={this.handler}
                  />
                </li>
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;
