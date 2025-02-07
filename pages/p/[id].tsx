import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter();

  return (
    <h1>Hello, @{router.query.id}, this page in dev.</h1>
  );
}