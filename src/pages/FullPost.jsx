import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with id:', id); // Логування ідентифікатора поста
        const res = await axios.get(`process.env.REACT_APP_API_URL/posts/${id}`); // Перевірка правильності URL
        console.log('Response:', res); // Логування повної відповіді
        if (res.status === 200) {
          console.log('Response data:', res.data); // Логування даних відповіді
          setData(res.data);
        } else {
          console.warn('Error status:', res.status);
          alert('Error fetching post');
        }
      } catch (err) {
        console.warn('Fetch error:', err);
        alert('Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost={true} />;
  }

  if (!data) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `process.env.REACT_APP_API_URL${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
    </>
  );
};
