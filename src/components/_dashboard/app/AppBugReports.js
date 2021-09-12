import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import bugFilled from '@iconify/icons-ant-design/ant-design-outlined';
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
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
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
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function AppBugReports() {
  const [, setNews] = useState([]);
  const [metadata, setMetadata] = useState(null);

  async function NewsData() {
    const response = await getRequest(`news/all?language=en&api_token=${API_TOKEN}`);
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
        <Icon icon={bugFilled} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(metadata)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total News In English
      </Typography>
    </RootStyle>
  );
}
