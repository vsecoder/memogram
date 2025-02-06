import { useState } from 'react';
import { Button, TextInput, Textarea, FileInput, Container, Title, Paper } from '@mantine/core';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

const UploadMemePage = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cookies = parseCookies();
    const author_id = cookies.id;

    if (!text || !title || !image) {
      alert('Please fill out all fields and upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('image', image);
    formData.append('author_id', author_id);

    try {
      const res = await fetch('/api/mems', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Meme uploaded successfully!');
        router.push('/');
      } else {
        alert('Error uploading meme: ' + result.error);
      }
    } catch (error) {
      alert('Something went wrong');
      console.error(error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Upload a Meme</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Text"
            placeholder="Enter meme text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            mt="md"
          />
          <TextInput
            label="Tags"
            placeholder="Enter tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            mt="md"
          />
          <FileInput
            label="Upload Image"
            placeholder="Choose image"
            onChange={(file) => setImage(file)}
            required
            mt="md"
          />
          <Button fullWidth mt="xl" type="submit">
            Upload Meme
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadMemePage;
