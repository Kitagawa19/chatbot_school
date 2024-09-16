'use client';
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../Context/authContext';
import { Button, Container, Grid, TextField, Typography, InputAdornment, IconButton, Box, Link, Snackbar, Paper,  } from '@mui/material';
import { Visibility,VisibilityOff  } from '@mui/icons-material';


export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [tabvalue,setTabvalue] = useState<number>(0);
    const [showSnackbar,setShowSnackbar] = useState<boolean>(false);
    const { login } = useAuth();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(email, password);
        setShowSnackbar(true);
    };


    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="メールアドレス"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="パスワード"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Box mt={3} textAlign='center'>
                <Typography  color='primary'>
                    <Link href='/Register' underline='hover'>
                    {'アカウントをお持ちではないですか？登録はこちら'}
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};