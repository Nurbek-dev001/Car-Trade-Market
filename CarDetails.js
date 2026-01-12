import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Paper
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Speed,
  LocalGasStation,
  Settings,
  CalendarToday,
  Palette,
  CheckCircle,
  Share
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateFavorites } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [orderDialog, setOrderDialog] = useState(false);
  const queryClient = useQueryClient();

  // Получение данных автомобиля
  const { data: carData, isLoading } = useQuery(['car', id], () =>
    axios.get(`/api/cars/${id}`).then(res => res.data.data)
  );

  // Проверка избранного
  const { data: favorites } = useQuery(
    'favorites',
    () => axios.get('/api/users/me/favorites').then(res => res.data.data),
    { enabled: !!user }
  );

  const isFavorite = favorites?.some(fav => fav._id === id);

  // Мутации
  const toggleFavoriteMutation = useMutation(
    () => {
      if (isFavorite) {
        return axios.delete(`/api/users/me/favorites/${id}`);
      } else {
        return axios.post('/api/users/me/favorites', { carId: id });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
        if (user) {
          axios.get('/api/users/me/favorites').then(res => {
            updateFavorites(res.data.data.length);
          });
        }
      }
    }
  );

  const createOrderMutation = useMutation(
    (orderData) => axios.post('/api/orders', orderData),
    {
      onSuccess: () => {
        setOrderDialog(false);
        navigate('/orders');
      }
    }
  );

  if (isLoading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (!carData) {
    return (
      <Container>
        <Alert severity="error">Автомобиль не найден</Alert>
      </Container>
    );
  }

  const car = carData;

  const orderSchema = Yup.object().shape({
    paymentMethod: Yup.string().required('Выберите способ оплаты'),
    deliveryAddress: Yup.object().shape({
      city: Yup.string().required('Город обязателен'),
      street: Yup.string().required('Улица обязательна'),
      house: Yup.string().required('Дом обязателен')
    }),
    notes: Yup.string().max(500, 'Максимум 500 символов')
  });

  const steps = ['Выбор автомобиля', 'Оформление заказа', 'Подтверждение'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Основное изображение */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={car.images && car.images.length > 0 ? car.images[selectedImage] : '/default-car.jpg'}
              alt={`${car.brand} ${car.model}`}
              sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
            />
            
            {/* Миниатюры */}
            {car.images && car.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, p: 2, overflowX: 'auto' }}>
                {car.images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 80,
                      height: 60,
                      border: selectedImage === index ? '2px solid #1976d2' : '1px solid #ddd',
                      borderRadius: 1,
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Card>

          {/* Описание */}
          <Card sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Typography color="textSecondary">
              {car.description || 'Описание отсутствует'}
            </Typography>
            
            {/* Особенности */}
            {car.features && car.features.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Особенности
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {car.features.map((feature, index) => (
                    <Chip
                      key={index}
                      icon={<CheckCircle fontSize="small" />}
                      label={feature}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Информация и действия */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1">
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {car.year} год
                  </Typography>
                </Box>
                
                <IconButton
                  onClick={() => toggleFavoriteMutation.mutate()}
                  disabled={!user}
                  color={isFavorite ? 'primary' : 'default'}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              {/* Статус */}
              <Chip
                label={car.status}
                color={
                  car.status === 'В наличии' ? 'success' :
                  car.status === 'Забронировано' ? 'warning' :
                  car.status === 'Продано' ? 'error' : 'default'
                }
                sx={{ mb: 3 }}
              />

              {/* Цена */}
              <Typography variant="h3" color="primary" gutterBottom>
                {car.price.toLocaleString()} ₸
              </Typography>

              {/* Характеристики */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalGasStation fontSize="small" color="action" />
                      <Typography variant="body2">{car.fuelType}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Settings fontSize="small" color="action" />
                      <Typography variant="body2">{car.transmission}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Speed fontSize="small" color="action" />
                      <Typography variant="body2">{car.mileage ? `${car.mileage.toLocaleString()} км` : 'Новый'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Palette fontSize="small" color="action" />
                      <Typography variant="body2">{car.color || 'Не указан'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">{car.year}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">{car.bodyType || '-'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Кнопки действий */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setOrderDialog(true)}
                  disabled={car.status !== 'В наличии' || !user}
                >
                  {car.status === 'В наличии' ? 'Забронировать' : car.status}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<Share />}
                  onClick={() => navigator.share?.({
                    title: `${car.brand} ${car.model}`,
                    text: `Посмотрите ${car.brand} ${car.model} ${car.year} года за ${car.price.toLocaleString()} ₸`,
                    url: window.location.href
                  }).catch(console.error)}
                >
                  Поделиться
                </Button>
                
                {!user && (
                  <Alert severity="info">
                    Для бронирования необходимо <Button color="inherit" onClick={() => navigate('/login')}>войти в систему</Button>
                  </Alert>
                )}
              </Box>

              {/* VIN */}
              {car.vin && (
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
                  VIN: {car.vin}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Диалог оформления заказа */}
      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Оформление заказа</DialogTitle>
        
        <Formik
          initialValues={{
            carId: id,
            paymentMethod: '',
            deliveryAddress: {
              city: '',
              street: '',
              house: '',
              apartment: ''
            },
            notes: ''
          }}
          validationSchema={orderSchema}
          onSubmit={(values) => {
            createOrderMutation.mutate(values);
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <DialogContent>
                <Stepper activeStep={0} sx={{ mb: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Typography variant="h6" gutterBottom>
                  Выбранный автомобиль
                </Typography>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={car.images && car.images.length > 0 ? car.images[0] : '/default-car.jpg'}
                        alt={car.brand}
                        style={{ width: '100%', borderRadius: 8 }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="h6">{car.brand} {car.model}</Typography>
                      <Typography color="textSecondary">{car.year} год</Typography>
                      <Typography variant="h5" color="primary">
                        {car.price.toLocaleString()} ₸
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="h6" gutterBottom>
                  Способ оплаты
                </Typography>
                <Field name="paymentMethod">
                  {({ field }) => (
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      {['cash', 'credit_card', 'installment', 'bank_transfer'].map((method) => (
                        <Button
                          key={method}
                          variant={field.value === method ? 'contained' : 'outlined'}
                          onClick={() => field.onChange({ target: { name: 'paymentMethod', value: method } })}
                          fullWidth
                        >
                          {method === 'cash' && 'Наличные'}
                          {method === 'credit_card' && 'Карта'}
                          {method === 'installment' && 'Рассрочка'}
                          {method === 'bank_transfer' && 'Банковский перевод'}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Field>
                {errors.paymentMethod && touched.paymentMethod && (
                  <Typography color="error" variant="caption">{errors.paymentMethod}</Typography>
                )}

                <Typography variant="h6" gutterBottom>
                  Адрес доставки
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Город"
                      name="deliveryAddress.city"
                      value={values.deliveryAddress.city}
                      onChange={handleChange}
                      error={touched.deliveryAddress?.city && Boolean(errors.deliveryAddress?.city)}
                      helperText={touched.deliveryAddress?.city && errors.deliveryAddress?.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Улица"
                      name="deliveryAddress.street"
                      value={values.deliveryAddress.street}
                      onChange={handleChange}
                      error={touched.deliveryAddress?.street && Boolean(errors.deliveryAddress?.street)}
                      helperText={touched.deliveryAddress?.street && errors.deliveryAddress?.street}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Дом"
                      name="deliveryAddress.house"
                      value={values.deliveryAddress.house}
                      onChange={handleChange}
                      error={touched.deliveryAddress?.house && Boolean(errors.deliveryAddress?.house)}
                      helperText={touched.deliveryAddress?.house && errors.deliveryAddress?.house}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Квартира"
                      name="deliveryAddress.apartment"
                      value={values.deliveryAddress.apartment}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Дополнительные пожелания"
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  error={touched.notes && Boolean(errors.notes)}
                  helperText={touched.notes && errors.notes}
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOrderDialog(false)}>Отмена</Button>
                <Button type="submit" variant="contained" disabled={createOrderMutation.isLoading}>
                  {createOrderMutation.isLoading ? 'Оформление...' : 'Оформить заказ'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  );
};

export default CarDetails;