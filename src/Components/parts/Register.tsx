'use client';
import React, { useState, FormEvent } from 'react';
import { Button, Container, Grid, TextField, Typography, InputAdornment, IconButton, Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



export const RegisterForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
    const [alertMessage,setAlertMessage] = useState<string>('');    

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const res = await fetch('',{
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            username: name,
            email: email,
            password: password
          })
        });
        if(res.ok){
          setShowSnackbar(true);
          setAlertMessage('ユーザー登録に成功しました');
        }
        else{
          setShowSnackbar(true);
          setAlertMessage('ユーザー登録に失敗しました');
        }
      }
      catch(err){
        setShowSnackbar(true);
        setAlertMessage('エラーが発生しました');
      }
    }
    const handleSnackbarClose = () => {
      setShowSnackbar(false);
    }
    return (
      <Container maxWidth='xs'>
        <Typography variant="h4" component="h1" gutterBottom>
          ユーザー登録
        </Typography>
        <form onSubmit={ handleSubmit }>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='名前'
                variant='outlined'
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                fullWidth
                label='メールアドレス'
                variant='outlined'
                type='email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                fullWidth
                label='パスワード'
                variant='outlined'
                type={showPassword ? 'text': 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label=' toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                        >
                        {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                      </IconButton> 
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                >
                登録
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClick={handleSnackbarClose}
            severity={alertMessage === 'ユーザー登録に成功しました' ? 'success' : 'error' }
            >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    )
};
