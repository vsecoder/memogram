import { useEffect } from 'react';
import { setCookie } from 'nookies';
import Router from 'next/router';

export default function Login() {
  useEffect(() => {
    setCookie(null, 'jwt', '', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie(null, 'id', '', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie(null, 'nickname', '', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      Router.push('/');
  });

  return;
}
