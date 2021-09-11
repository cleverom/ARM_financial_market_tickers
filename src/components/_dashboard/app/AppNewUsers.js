import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import appleFilled from '@iconify/icons-ant-design/apple-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import { getRequest } from '../../../services/request';
import { errors } from '../../../services/swal_mixin';
import { API_TOKEN } from '../../../services/config';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function AppNewUsers() {
  const [, setNews] = useState([]);
  const [metadata, setMetadata] = useState(null);

  async function NewsData() {
    const response = await getRequest(
      `news/all?filter_entities=true&language=en&sentiment_gte=0&api_token=${API_TOKEN}`
    );
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
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={appleFilled} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(metadata)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Toyal Positive News
      </Typography>
    </RootStyle>
  );
}
