import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "axios";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        console.log('Response data:', res.data); // Додайте це логування
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.warn(err);
        alert('Error fetching post');
        setLoading(false);
      }
    };
    

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost={true} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>
          {data.text}
        </p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Дмитро Грабовський",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Коментар для сайту",
          },
          {
            user: {
              fullName: "Рома Романовський",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
