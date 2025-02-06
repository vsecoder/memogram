import { useState } from 'react';
import { setCookie } from 'nookies';
import Router from 'next/router';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Container,
  Group,
  Button,
} from '@mantine/core';
import Link from 'next/link';

const url = '/api/auth/login';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const loginInfo = {
      email,
      password,
    };

    const login = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginInfo),
    });

    const loginResponse = await login.json();

    if (!loginResponse.error) {
      // Установка JWT и данных пользователя в cookies
      setCookie(null, 'jwt', loginResponse.jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie(null, 'id', loginResponse.user.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie(null, 'nickname', loginResponse.user.nickname, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      Router.push('/');
    } else {
      alert('Ошибка входа: ' + loginResponse.error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={({ fontWeight: 900 })}>
        Приветствуем снова!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="Ваш email" required onChange={(e) => setEmail(e.target.value)} value={email} />
        <PasswordInput label="Пароль" placeholder="Ваш пароль" required mt="md" onChange={(e) => setPassword(e.target.value)} value={password} />
        <Group position="apart" mt="md">
          <Checkbox label="Запомнить меня" />
        </Group>
        <Button fullWidth mt="xl" onClick={handleLogin} type="submit">
          Войти
        </Button>
        <Link href="/register">
          <a>Ещё нет аккаунта? Зарегистрируйтесь!</a>
        </Link>
      </Paper>
    </Container>
  );
}
