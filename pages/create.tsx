import { useState, useEffect, SetStateAction } from 'react';
import { parseCookies } from 'nookies';
import Router from 'next/router';
import {
    TextInput,
    Paper,
    Title,
    Container,
    FileInput,
    Center,
    Button,
    Input
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

const url = "https://c34a-95-107-46-219.eu.ngrok.io/";
  
export default function create() {
  const name = parseCookies().username;
  const jwt = parseCookies().jwt;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [value, setValue] = useState<File | null>(null);

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

  async function handleCreateMem() {
    if (title == '' || description == '' || tags == '' || value === null) {
      showNotification({
        title: 'Error',
        message: 'Пожалуйста, заполните все поля',
      })
      return;
    }
    /* eslint-disable */
    var t: [] = [];
    tags.split(' ').map((tag) => {
      t: [] = [...t, {name: tag}];
    })

    const formData = new FormData();
    formData.append('files', value);
    const image = await fetch(`${url}/api/upload`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: formData
    })

    const json = await image.json();
    console.log(json[0].formats.medium.url);
    const memInfo = {data:{
      title: title,
      text: description,
      image: json[0].formats.medium.url,
      tags: t,
      author: name,
    }}
    console.log(value);

    const mem = await fetch(`${url}/api/mems`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(memInfo)
    })

    const memResponse = await mem.json();

    console.log(memResponse.data)
    if (!memResponse.error) {
        Router.push('/')
    } else {
        showNotification({
            title: 'Error',
            message: 'Что-то пошло не так!',
        })
    }

  }

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={({ fontWeight: 900 })}
      >
        Создать мем
      </Title>
  
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Input placeholder="Заголовок" value={title} onChange={(event: { target: { value: SetStateAction<string>; }; }) => setTitle(event.target.value)} mt={10} />
        <Input placeholder="Описание" value={description} onChange={(event: { target: { value: SetStateAction<string>; }; }) => setDescription(event.target.value)} mt={10} />
        <Input placeholder="Теги (через пробел)" value={tags} onChange={(event: { target: { value: SetStateAction<string>; }; }) => setTags(event.target.value)} mt={10} />
        <FileInput label="Загрузить мем" placeholder="Загрузить мем" accept="image/png,image/jpeg" value={value} onChange={setValue} />
        <Button onClick={handleCreateMem} mt={20}>Опубликовать</Button>
      </Paper>
    </Container>
  );
}