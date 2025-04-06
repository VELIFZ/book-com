import { useState } from 'react'
import { InputBase, IconButton, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, color: 'inherit' }}
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px', color: 'inherit' }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchBar 