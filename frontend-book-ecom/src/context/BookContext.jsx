// Manages book data globally (optional, use if needed).

// Global state = Data shared across multiple components (e.g., user info, cart items, book list).
// Why use it? Avoids prop drilling (passing data through many components).
// Optional? Yes! If state is simple, useState in App.jsx is enough.
// Use Context API when many components need the same data. 