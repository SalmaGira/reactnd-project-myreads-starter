import React from "react";
import * as BooksAPI from "../BooksAPI";
import "../App.css";
// import Button from "react-bootstrap/Button";

class BookCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;

    if (this.state.activeShelf === "none") this.getShelf();

    this.handleChange = this.handleChange.bind(this);
  }
  async handleChange(event) {
    const newShelf = event.target.value;
    await BooksAPI.update({ id: this.props.bookId }, newShelf);
    this.setState({ activeShelf: newShelf });

    // this.props.action();
  }

  async getShelf() {
    const bookId = this.state.bookId;
    const shelfBook = await BooksAPI.get(bookId);
    const shelf = shelfBook.shelf;
    this.setState({ activeShelf: shelf });
    return shelf;
  }

  render() {
    const {
      bookId,
      activeShelf,
      bookTitle,
      bookAuthor,
      bookImageUrl,
    } = this.state;

    const bookOptions = [
      //   ("Move to...", "move"),
      { text: "Currently Reading", value: "currentlyReading" },
      { text: "Want to Read", value: "wantToRead" },
      { text: "Read", value: "read" },
      { text: "None", value: "none" },
    ];

    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 192,
              backgroundImage: `url(${bookImageUrl})`,
            }}
          />
          <div className="book-shelf-changer">
            <select value={this.state.activeShelf} onChange={this.handleChange}>
              <option value="move" disabled>
                Move to...
              </option>
              {bookOptions.map((oneOption) => (
                <option
                  key={oneOption.value}
                  value={oneOption.value}
                  // selected={oneOption.value === activeShelf}
                >
                  {oneOption.text}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="book-title">{bookTitle}</div>
        <div className="book-authors">{bookAuthor}</div>
        {/* <button onClick={this.props.action} /> */}
      </div>
    );
  }
}

export default BookCard;
