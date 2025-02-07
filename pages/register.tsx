import { useState } from 'react';
import { setCookie } from 'nookies';
import Router from 'next/router';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
} from '@mantine/core';
import Link from 'next/link';

const url = '/api/auth/register';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const registerInfo = {
      email,
      username,
      password,
    };

    const register = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerInfo),
    });

    const registerResponse = await register.json();

    if (!registerResponse.error) {
      setCookie(null, 'jwt', registerResponse.jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie(null, 'id', registerResponse.user.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie(null, 'nickname', registerResponse.user.nickname, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      Router.push('/');
    } else {
      alert('Ошибка регистрации: ' + registerResponse.error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={({ fontWeight: 900 })}>
        Создать новый аккаунт
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="Ваш email" required onChange={(e) => setEmail(e.target.value)} value={email} />
        <TextInput label="Username" placeholder="Имя профиля" required mt="md" onChange={(e) => setUsername(e.target.value)} value={username} />
        <PasswordInput label="Пароль" placeholder="Ваш пароль" required mt="md" onChange={(e) => setPassword(e.target.value)} value={password} />
        <Button fullWidth mt="xl" onClick={handleRegister} type="submit">
          Зарегистрироваться
        </Button>
        <Link href="/login">
          <a>Уже есть аккаунт? Войдите!</a>
        </Link>
      </Paper>
    </Container>
  );
}
