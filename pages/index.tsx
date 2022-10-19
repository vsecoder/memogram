import { FooterSocial } from '../components/footer';
import { CardBlock } from '../components/card';
import { AmethystLogo } from '../components/logo';
import { useState, useEffect } from 'react';
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
import axios from "axios";

const url = "http://localhost:1337";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
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

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },
}));


export default function IndexPage() {
  const [mems, setMems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [active, setActive] = useState('Свежее');

  const [name, setName] = useState('...')
  const jwt = parseCookies().jwt;
  const id = parseCookies().id;
  //const username = parseCookies().username;
  useEffect(() => {
    const n = parseCookies().username;
    if (n) {
      setName(n)
    } else {
      setName('Войти')
    }
  }, [])
  const user= {name: name};
  const tabs = [
    'Свежее',
    'Подписки',
    'Рекомендации',
  ]
  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} onClick={() => {setActive(tab)}}>
      {tab}
    </Tabs.Tab>
  ));

  useEffect(() => {
    if (fetching) {
      axios.get(`${url}/api/mems?pagination[page]=${currentPage}&pagination[pageSize]=10&populate=*&sort[0]=title%3Adesc`)
        .then(response => {
          setMems([...mems, ...response.data.data]);
          if (response.data.data.length != 0) {
            setCurrentPage(prevState => prevState + 1);
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching])

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
      setFetching(true);
    }
  }

  useEffect(() => {
    console.log('scroll');
    document.addEventListener('scroll', scrollHandler);

    return function () {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, []);

  return (
    <>
      <Header className={classes.header} height={143} p="md">
        <Container className={classes.mainSection}>
          <Group position="apart">
            <AmethystLogo />

            <Menu
              width={260}
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
                    <Avatar src='' alt={user.name} size={30} />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.name == 'Войти' && <>Unknown</>}
                      {user.name != 'Войти' && user.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <SwitchToggle />
                </Menu.Item>
                {user.name != 'Войти' && 
                <>
                  <Link href={'/p/'+user.name}>
                    <Menu.Item icon={<IconUserExclamation size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      Профиль
                    </Menu.Item>
                  </Link>
                  <Link href='/create'>
                    <Menu.Item icon={<IconCirclePlus size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      Опубликовать
                    </Menu.Item>
                  </Link>
                  <Link href='/logout'>
                    <Menu.Item icon={<IconLogout size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      Выйти из аккаунта
                    </Menu.Item>
                  </Link>
                </>
                }
                {user.name == 'Войти' && 
                  <Link href='/auth'>
                    <Menu.Item icon={<IconUserPlus size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      Войти
                    </Menu.Item>
                  </Link>
                }
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
        <Container>
          <Tabs
            defaultValue="Свежее"
            variant="outline"
            classNames={{
              tabsList: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>{items}</Tabs.List>
          </Tabs>
        </Container>
      </Header>
      <Container>
        {active == 'Свежее' && 
          <>
            { mems.map((mem) => {
              let tags:string = '';
              for (let i = 0; i < mem.attributes.tags.length; i++) {
                tags = tags + `#${mem.attributes.tags[i].name}`;
              }
              return (
                <CardBlock title="test"
                  image={url+mem.attributes.image.data.attributes.formats.medium.url}
                  text={mem.attributes.title}
                  author={tags} /> 
                )
            })}
          </>
        }
      </Container>
      <FooterSocial />
    </>
  );
}