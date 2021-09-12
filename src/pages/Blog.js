import { useEffect, useState } from 'react';
// material
import { Grid, Container, Stack, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { BlogPostCard } from '../components/_dashboard/blog';
//
import { getRequest } from '../services/request';
import { errors } from '../services/swal_mixin';
import { API_TOKEN } from '../services/config';
import Loading from '../components/loading';

export default function Blog() {
  const [news, setNews] = useState([]);
  const [, setMetadata] = useState(0);
  const [loading, setLoading] = useState(false);

  async function NewsData() {
    setLoading(true);
    const response = await getRequest(`news/all?language=en&api_token=${API_TOKEN}`);
    setLoading(false);
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

  useEffect(() => {
    NewsData();
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <Page title="Dashboard: Blog | Finance">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Blog
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {news.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        </Container>
      </Page>
    </>
  );
}
