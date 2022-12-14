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
import Router from 'next/router';

const url = "https://c34a-95-107-46-219.eu.ngrok.io";

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
  tab1: {
    ['@media (max-width: 600px)']: {
      padding: '5px'
    },
  }
}));

interface EventInterface {
  target: EventTarget;
}

export default function IndexPage() {
  const [mems, setMems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [active, setActive] = useState('????????????');

  const [name, setName] = useState('...')
  const jwt = parseCookies().jwt;

  useEffect(() => {
    const n = parseCookies().username;
    if (n) {
      setName(n)
    } else {
      setName('??????????')
    }
  }, [])
  const user= {name: name};
  const tabs = [
    '????????????',
    '????????????????',
    '????????????????????????',
  ]
  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} onClick={() => {setActive(tab)}} className={classes.tab1}>
      {tab}
    </Tabs.Tab>
  ));

  useEffect(() => {
    if (fetching) {
      axios.get(`${url}/api/mems?pagination[page]=${currentPage}&pagination[pageSize]=10&populate=*&sort[0]=id%3Adesc`)
        .then(response => {
          /* eslint-disable */
          let d: any = [...mems, ...response.data.data];
          setMems(d);
          console.log(mems);
          if (response.data.data.length != 0) {
            setCurrentPage(prevState => prevState + 1);
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching])

  async function check_jwt() {
    if (jwt) {
      const r = await fetch(`${url}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      const res = await r.json();
      console.log(res);
      console.log(res.statusCode);
      if (res.error || res.statusCode == 401 || res.statusCode == 403) {
        Router.push('/logout');
      }
    }
  }


  useEffect(() => {
    check_jwt()
  }, [])

  const scrollHandler = (e: {target: any}) => {
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
                      {user.name == '??????????' && <>Unknown</>}
                      {user.name != '??????????' && user.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <SwitchToggle />
                </Menu.Item>
                {user.name != '??????????' && 
                <>
                  <Link href={'/p/'+user.name}>
                    <Menu.Item icon={<IconUserExclamation size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      ??????????????
                    </Menu.Item>
                  </Link>
                  <Link href='/create'>
                    <Menu.Item icon={<IconCirclePlus size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      ????????????????????????
                    </Menu.Item>
                  </Link>
                  <Link href='/logout'>
                    <Menu.Item icon={<IconLogout size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                      ?????????? ???? ????????????????
                    </Menu.Item>
                  </Link>
                </>
                }
                {user.name == '??????????' && 
                  <>
                    <Link href='/login'>
                      <Menu.Item icon={<IconUserPlus size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                        ??????????
                      </Menu.Item>
                    </Link>
                    <Link href='/register'>
                      <Menu.Item icon={<IconUserPlus size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                        ??????????????????????
                      </Menu.Item>
                    </Link>
                  </>
                }
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
        <Container>
          <Tabs
            defaultValue="????????????"
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
        {active == '????????????' && 
          <>
            { mems.map((mem: {attributes: {
              text: string;
              image: string;
              title: string;
              tags: [{name: string, image: string, title: string}]
            }}) => {
              let tags:string = '';
              for (let i = 0; i < mem.attributes.tags.length; i++) {
                tags = tags + `#${mem.attributes.tags[i].name}`;
              }
              return (
                <CardBlock title={mem.attributes.title}
                  image={url+mem.attributes.image}
                  text={mem.attributes.text}
                  author={tags}
                  key={mem.attributes.image} /> 
                )
            })}
          </>
        }
        {active == '????????????????' && name != '??????????' &&
          <>
            ?? ????????????????????
          </>
        }
        {active == '????????????????' && name == '??????????' &&
          <>
            ?????????????? ?? ??????????????, ?????????? ????????????????????
          </>
        }
        {active == '????????????????????????' && name != '??????????' &&
          <>
            ?? ????????????????????
          </>
        }
        {active == '????????????????????????' && name == '??????????' &&
          <>
            ?????????????? ?? ??????????????, ?????????? ????????????????????
          </>
        }
      </Container>
      <FooterSocial />
    </>
  );
}
