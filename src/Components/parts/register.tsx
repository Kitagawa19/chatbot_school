'use client';
import React, { useState, FormEvent } from 'react';
import { Button, Container, Grid, TextField, Typography, InputAdornment, IconButton } from '@mui/material';



export const RegisterForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();
    const async handlesubmit = () => {
      const res =  await fetch('',{
        headers:{
            `Content-Type`: 'applocation/json'
        },
        bodys:{
          username:name,
          email:email,
          password:password,
        }
      })
      const data = await res.json();
    }
    return(
        <>
        </>
    )
};
