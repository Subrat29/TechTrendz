import React, { useEffect, useState } from 'react'
import fileservice from "../appwrite/fileConfig"
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, Image, Stack, Heading, Text, Button, Center } from '@chakra-ui/react';

function PostCard2({ post }) {
    const { $id, title, image, userId, $updatedAt } = post;
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        const fetchImageUrl = async () => {
            const url = await fileservice.getImagePreview(image)
            setImageUrl(url)
        }
        fetchImageUrl()
    }, [image])

    return (
        <Center>
            <Link to={`/post/${$id}`}>
                <Card
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                >
                    <Stack >
                        <CardBody>
                            <Heading size='md'>{title}</Heading>
                            <Text py='2'>
                                Caffè latte is a coffee beverage of Italian origin made with espresso
                                and steamed milk.
                            </Text>
                        </CardBody>
                        <CardFooter>
                                <Heading size='sm'>Read more →</Heading>
                        </CardFooter>
                    </Stack>
                    {imageUrl && <Image
                        objectFit='cover'
                        // maxW={{ base: '100%', sm: '300px' }}
                        src={imageUrl}
                        alt={title}
                        rounded={10}
                        p={1}
                    />}
                </Card>
            </Link>
        </Center>
    )
}

export default PostCard2
