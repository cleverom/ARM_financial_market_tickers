import { useEffect, useState } from 'react';
// material
import { Grid, Container, Stack, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../components/_dashboard/blog';
//
import POSTS from '../_mocks_/blog';
import { getRequest } from '../services/request';
import { errors } from '../services/swal_mixin';
import { API_TOKEN } from '../services/config';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' }
];

// ----------------------------------------------------------------------

export default function Blog() {
  const [news, setNews] = useState([]);
  const [metadata, setMetadata] = useState(0);

  async function NewsData() {
    const response = await getRequest(`news/all?language=en&api_token=${API_TOKEN}`);
    console.log(response);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (status !== 200) {
      return errors(error.message);
    }
    if (status === 200) {
      setNews(data);
      setMetadata(meta?.found);
    }
  }

  console.log(news, metadata);

  useEffect(() => {
    NewsData();
  }, []);

  return (
    <Page title="Dashboard: Blog | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
