# E-Commerce Book App

A React-based e-commerce application for books, built as part of my learning journey with React components, props, and state management.

## What I Learned

During this project, I gained hands-on experience with:
- Building React components from scratch
- Managing state with useState hook
- Passing data between components using props
- Creating responsive layouts with CSS
- Working with component hierarchies

## Project Structure

```
src/
  ├── components/
  │   ├── BookList.jsx     # Displays grid of books
  │   ├── BookItem.jsx     # Individual book card
  │   └── BookDetail.jsx   # Detailed view of a book
  ├── styles/
  │   ├── BookList.css
  │   ├── BookItem.css
  │   └── BookDetail.css
  └── App.jsx             # Main component with book data
```

## Features I Implemented

- Display books in a responsive grid layout
- Show book details including title, price, and description
- Filter books by format/category
- Image display for each book
- Custom CSS styling for visual appeal

## Challenges I Faced

1. **Component Organization**: Initially struggled with deciding how to break down the app into components. Solved by sketching out the structure first and identifying reusable parts.

2. **State Management**: Learning when to use state and where to place it. Realized keeping book data in the parent component made the most sense for data flow.

3. **CSS Styling**: Started with basic styles and gradually improved the design. Learned about CSS Grid and Flexbox along the way.

## Running the Project

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:5173 in your browser

## Future Improvements

Features I plan to add:
- [ ] Search functionality
- [ ] Shopping cart
- [ ] User authentication
- [ ] Book ratings and reviews

## Credits

Built by [Your Name] as part of learning React fundamentals.
Used Vite for project setup and Material-UI for components.
