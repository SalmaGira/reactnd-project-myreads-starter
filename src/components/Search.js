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

  async componentDidUpdate(query) {
    let booksFromShelves = await BooksAPI.getAll().then();
    this.setState({ booksFromShelves: booksFromShelves });

    let booksFromSearch = await BooksAPI.search(query);

    booksFromSearch.filter((bookFromSearch, indexSearch) => {
      booksFromShelves.filter((bookFromShelves, indexShelf) => {
        if (bookFromSearch.id === bookFromShelves.id) {
          booksFromSearch[indexSearch].shelf =
            booksFromShelves[indexShelf].shelf;
          return;
        }
      });
    });

    if (!booksFromSearch || booksFromSearch.error) {
      this.setState({ booksFromSearch: null });
    } else if (Array.isArray(booksFromSearch)) {
      this.setState({ booksFromSearch: booksFromSearch });
    }
  }

  updateQuery = (query) => {
    this.setState(() => ({
      query: query.trim(),
    }));

    this.componentDidUpdate(query.trim());
  };

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
