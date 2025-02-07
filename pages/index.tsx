import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { FooterSocial } from '../components/footer';
import { CardBlock } from '../components/card';
import { AmethystLogo } from '../components/logo';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Header,
} from '@mantine/core';
import {
  IconLogout,
  IconChevronDown,
  IconUserExclamation,
  IconUserPlus,
  IconCirclePlus
} from '@tabler/icons';
import { SwitchToggle } from '../components/themetoggle';
import Link from 'next/link';
import { parseCookies } from 'nookies';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
    }`,
  },
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
  },
  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
}));

interface Tag {
  id: string;
  name: string;
  image: string;
  title: string;
}

interface Mem {
  id: string;
  text: string;
  image: string;
  title: string;
  likes: number;
  created_at: string;
  author: {
    id: string;
    nickname: string;
  };
  tags: Tag[];
  moderated: boolean;
}

const useMems = () => {
  const [mems, setMems] = useState<Mem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (fetching) {
      fetch(`/api/get?page=${currentPage}&pageSize=3`)
        .then(res => res.json())
        .then(response => {
          setMems(prev => [...prev, ...response.data]);
          if (response.data.length !== 0) {
            setCurrentPage(prev => prev + 1);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  return { mems, setFetching };
};

const checkJwt = async (jwt: string | null, router: any) => {
  if (jwt) {
    const res = await fetch('/api/user/me', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();

    if (data.error) {
      router.push('/logout');
    }
  }
};

const Observer = ({ onIntersect }: any) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [onIntersect]);

  return <div ref={observerRef} style={{ height: '10px' }} />;
};

export default function IndexPage() {
  const { classes, cx, theme } = useStyles();
  const { mems, setFetching } = useMems();
  const jwt = parseCookies().jwt;
  const [name, setName] = useState('...');
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const n = parseCookies().nickname;
    setName(n ? n : 'Войти');
  }, []);

  useEffect(() => {
    checkJwt(jwt, router);
  }, [jwt]);

  useEffect(() => {
    setFetching(true);
  }, []);

  return (
    <>
      <Header className={classes.header} height='auto'>
        <Container>
          <Group position="apart">
            <AmethystLogo />
            <Menu
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                  <Group spacing={7}>
                    {name !== 'Войти' && (
                      <Avatar src='' alt={name} size={30} />
                    )}
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item><SwitchToggle /></Menu.Item>
                {name !== 'Войти' ? (
                  <>
                    <Link href={`/p/${name}`}><Menu.Item icon={<IconUserExclamation size={14} />} >Профиль</Menu.Item></Link>
                    <Link href='/create'><Menu.Item icon={<IconCirclePlus size={14} />} >Опубликовать</Menu.Item></Link>
                    <Link href='/logout'><Menu.Item icon={<IconLogout size={14} />} >Выйти</Menu.Item></Link>
                  </>
                ) : (
                  <>
                    <Link href='/login'><Menu.Item icon={<IconUserPlus size={14} />} >Войти</Menu.Item></Link>
                    <Link href='/register'><Menu.Item icon={<IconUserPlus size={14} />} >Регистрация</Menu.Item></Link>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </Header>
      {(
        <>
          {mems.map((mem) => {
            const tags = mem.tags.map(tag => `#${tag.name}`).join(' ');
            if (!mem.moderated) return null;
            return (
              <CardBlock
                key={mem.id}
                title={mem.title}
                image={mem.image}
                text={mem.text}
                author={tags}
                likes={mem.likes}
              />
            );
          })}
          <Observer onIntersect={() => setFetching(true)} />
        </>
      )}
      <Container>
        <p>Loading</p>
      </Container>
      <FooterSocial />
    </>
  );
}
