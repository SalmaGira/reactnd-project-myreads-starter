import React from "react";
import * as BooksAPI from "../BooksAPI";
import "../App.css";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";

class Dashboard extends React.Component {
  state = {
    allBooksShelf: null,
  };

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
  }

  async componentDidMount() {
    const allBooks = await BooksAPI.getAll().then();
    this.setState({ allBooksShelf: allBooks });
  }

  async componentDidUpdate() {
    const allBooks = await BooksAPI.getAll().then();
    this.setState({ allBooksShelf: allBooks });
  }

  async handler() {
    this.componentDidUpdate();
  }

  render() {
    const { allBooksShelf } = this.state;

    const shelves = [
      { title: "Currently Reading", value: "currentlyReading" },
      { title: "Want to Read", value: "wantToRead" },
      { title: "Read", value: "read" },
    ];

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          <div>
            {shelves.map((shelf) => (
              <div className="bookshelf" key={shelf.value}>
                <h2 className="bookshelf-title">{shelf.title}</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {allBooksShelf &&
                      allBooksShelf
                        .filter((book) => book.shelf === shelf.value)
                        .map((book) => (
                          <li key={book.id}>
                            <BookCard
                              key={book.id}
                              bookId={book.id}
                              activeShelf={book.shelf}
                              bookTitle={book.title}
                              bookAuthor={book.authors}
                              bookImageUrl={book.imageLinks.thumbnail}
                              action={this.handler}
                              // handleShelf={this.handleShelf}
                            />
                          </li>
                        ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="open-search">
          <Link to={"/search"} className="open-search">
            <button className="open-search">Add a book</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Dashboard;
