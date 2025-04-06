import { Box, Button, ButtonGroup } from '@mui/material'
import '../styles/CategoryFilter.css'

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Box className="category-filter">
      <ButtonGroup variant="outlined" aria-label="book format filter">
        {categories.map(category => (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            variant={selectedCategory === category ? "contained" : "outlined"}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}

export default CategoryFilter 