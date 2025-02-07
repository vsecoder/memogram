import { createStyles, Card, Image, Text, Container, Button } from '@mantine/core';
import { IconHeart } from '@tabler/icons';
import { useCounter } from '@mantine/hooks';


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
  button: {
    justifyContent: 'end'
  },
  buttonIcon: {
    marginRight: '10px'
  }
}));

interface CardData {
  title: string,
  image: string,
  text: string,
  author: string,
  likes: number,
}

export function CardBlock({ title, image, text, author, likes }: CardData) {
  const { classes } = useStyles();
  const [value, { increment, decrement }] = useCounter(likes, { min: 0 });

  return (
    <Container py="xl" key={title}>
      <div className={classes.grid}>
        <Card key={title} p="md" radius="md" component="a" className={classes.card}>
          <Image src={image} />
          <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
            {author}
          </Text>
          <Text className={classes.title} mt={5}>
            {title}
          </Text>
          <Text className={classes.text} mt={5}>
            {text}
          </Text>
          <Button.Group mt={10} className={classes.button}>
            <Button variant="default" onClick={decrement}>
              <IconHeart className={classes.buttonIcon} /> <span>{value}</span>
            </Button>
          </Button.Group>
        </Card>
      </div>
    </Container>
  );
}