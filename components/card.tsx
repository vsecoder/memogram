import { createStyles, SimpleGrid, Card, Image, Text, Container, AspectRatio } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    minWidth: '300px',
    maxWidth: '600px',
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },

  text: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 400,
  },
  grid: {
    margin: 'auto',
    minWidth: '300px',
    width: '100%',
    maxWidth: '600px',
    border: '1px #1a1b1e solid',
    borderRadius: '10px'
  },
}));

interface CardData {
  title: string,
  image: string,
  text: string,
  author: string,
}

export function CardBlock({ title, image, text, author }: CardData) {
  const { classes } = useStyles();

  return (
    <Container py="xl" key={title}>
      <div className={classes.grid}>
        <Card key={title} p="md" radius="md" component="a" className={classes.card}>
          <AspectRatio ratio={1920 / 1080}>
            <Image src={image} />
          </AspectRatio>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
            {author}
          </Text>
          <Text className={classes.title} mt={5}>
            {title}
          </Text>
          <Text className={classes.text} mt={5}>
            {text}
          </Text>
        </Card>
      </div>
    </Container>
  );
}