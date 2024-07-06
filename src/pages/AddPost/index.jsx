import React from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from "../../redux/slices/auth";
import axios from '../../axios';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn('Error:', err);
      alert('Error upload file');
    } 
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };
 
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    if (!title || !text) {
      alert('Title and text are required fields.');
      return;
    }

    try {
      setLoading(true);
      const fields = {
        title,
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()), // Перетворення тегів у масив
        text
      };
      console.log('Submitting fields:', fields); // Додано логування полів
      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);
      console.log('Response data:', data); // Додано логування відповіді сервера
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn('Error creating post:', err.response?.data); // Логування помилки
      if (err.response?.data) {
        alert(`Error creating post: ${JSON.stringify(err.response.data)}`);
      } else {
        alert('Error creating post');
      }
    }
  };

  React.useEffect(() => {
    if(id){
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn('Error fetching post:', err);
          alert('Error fetching post');
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter the text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} style={{ marginRight: 10 }} variant="outlined" size="large">
        Upload the preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)} 
        fullWidth 
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publish'}
        </Button>
        <a href="/">
          <Button size="large">Undo</Button>
        </a>
      </div>
    </Paper>
  );
};
