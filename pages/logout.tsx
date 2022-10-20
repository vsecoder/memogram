import { setCookie } from 'nookies';
import Router from 'next/router';
import { Button } from '@mantine/core';
  
export default function logout() {
    setCookie(null, 'jwt', '' , {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    })
    setCookie(null, 'id', '' , {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    })
    setCookie(null, 'username', '' , {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    })
    Router.push('/')

    return (
        <>
            <p>Вы вышли(или вас выкинуло) из аккаунта</p>
            <Button onClick={() => Router.push('/')}>На главную</Button>
        </>
    );
}