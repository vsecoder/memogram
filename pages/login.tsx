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
import { showNotification } from '@mantine/notifications';
import Link from 'next/link';

const url = "https://c34a-95-107-46-219.eu.ngrok.io";
  
  export default function login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin() {
        const loginInfo = {
            identifier: username,
            password: password
        }

        const login = await fetch(`${url}/api/auth/local`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        })

        const loginResponse = await login.json();

        console.log(loginResponse.data)
        if (!loginResponse.error) {
            setCookie(null, 'jwt', loginResponse.jwt , {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            })
            setCookie(null, 'id', loginResponse.user.id , {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            })
            setCookie(null, 'username', loginResponse.user.username , {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            })
            Router.push('/')
        } else if (loginResponse.error.status == 400) {
            showNotification({
                title: 'Error',
                message: 'Пароль или почта не правильны!',
            })
        } else {
            showNotification({
                title: 'Error',
                message: 'Серверная ошибка, попробуйте позже!',
            })
        }

    }

    return (
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={({ fontWeight: 900 })}
        >
          Приветствуем снова!
        </Title>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" placeholder="Ваше имя профиля" required onChange={e => setUsername(e.target.value) } value={username} />
          <PasswordInput label="Пароль" placeholder="Ваш пароль" required mt="md" onChange={e => setPassword(e.target.value) } value={password}  />
          <Group position="apart" mt="md">
            <Checkbox label="Запомнить меня" />
          </Group>
          <Button fullWidth mt="xl" onClick={() => handleLogin() } type='submit'>
            Войти
          </Button>
          <Link href="/register">
            Уже есть аккаунт
          </Link>
        </Paper>
      </Container>
    );
}