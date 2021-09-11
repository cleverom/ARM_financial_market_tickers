/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@material-ui/core';
// utils
//
import Scrollbar from '../../Scrollbar';
import { getRequest } from '../../../services/request';
import { errors } from '../../../services/swal_mixin';
import { API_TOKEN } from '../../../services/config';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.object.isRequired
};

function NewsItem({ news }) {
  const { image_url, title, description } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={image_url}
        sx={{ width: 48, height: 48, borderRadius: 1.5 }}
      />
      <Box sx={{ minWidth: 240 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {formatDistance(new Date(), new Date())}
      </Typography>
    </Stack>
  );
}

export default function AppNewsUpdate() {
  const newDate = new Date().toISOString().slice(0, 10);
  const [news, setNews] = useState([]);

  async function NewsData() {
    const response = await getRequest(
      `news/all?language=en&published_on=${newDate}&api_token=${API_TOKEN}`
    );
    const { data, error } = response?.data;
    const status = response?.status;
    if (status !== 200) {
      return errors(error.message);
    }
    if (status === 200) {
      setNews(data);
    }
  }

  useEffect(() => {
    NewsData();
  }, []);

  return (
    <Card>
      <CardHeader title="News Update" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {news.map((news) => (
            <NewsItem key={news.title} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="/dashboard/news"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}
