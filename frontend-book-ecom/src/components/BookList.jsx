// handles multiple books

import { Grid, Container } from '@mui/material'
import BookItem from './BookItem'
import '../styles/BookList.css'

// receives books as a props from Book.jsx
const BookList = ({ books }) => {
  return (
    <section className="book-list-section">
      <Container className="book-list-container">
        <Grid container className="book-grid">
          {/* map through books and render each book \ bunu kullan: rendering a BookItem component for each one. */}
          {books.map((book) => (
            // <Grid item> → Places each book in its own grid cell.
            <Grid 
              item 
              key={book.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="book-grid-item"
            >
              <div className="book-card-wrapper">
                {/* <BookItem book={book} />  Sends a single book's data to >> BookItem.jsx*/}
                <BookItem book={book} />
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

export default BookList 