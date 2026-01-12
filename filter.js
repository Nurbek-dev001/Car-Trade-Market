import React, { useState } from 'react';
import {
  Box, TextField, MenuItem, Button, Slider, Typography,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

const CarFilter = ({ onFilter, brands, loading }) => {
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceRange: [0, 1000000],
    fuelType: '',
    transmission: '',
  });

  const fuelTypes = ['Бензин', 'Дизель', 'Электричество', 'Гибрид', 'Газ'];
  const transmissions = ['Автоматическая', 'Механическая', 'Робот', 'Вариатор'];

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handlePriceChange = (event, newValue) => {
    setFilters({
      ...filters,
      priceRange: newValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceRange: [0, 1000000],
      fuelType: '',
      transmission: '',
    });
    onFilter({});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Фильтры</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            select
            fullWidth
            label="Марка"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
          >
            <MenuItem value="">Все марки</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Модель"
            name="model"
            value={filters.model}
            onChange={handleChange}
            margin="normal"
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography gutterBottom>Год выпуска</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="От"
                name="yearFrom"
                value={filters.yearFrom}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1990, max: new Date().getFullYear() } }}
              />
              <TextField
                type="number"
                label="До"
                name="yearTo"
                value={filters.yearTo}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1990, max: new Date().getFullYear() } }}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography gutterBottom>
              Цена: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} ₸
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000000}
              step={10000}
              valueLabelFormat={(value) => `${value.toLocaleString()} ₸`}
            />
          </Box>

          <TextField
            select
            fullWidth
            label="Тип топлива"
            name="fuelType"
            value={filters.fuelType}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="">Все</MenuItem>
            {fuelTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Коробка передач"
            name="transmission"
            value={filters.transmission}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="">Все</MenuItem>
            {transmissions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              fullWidth
            >
              Найти
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              fullWidth
            >
              Сбросить
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CarFilter;