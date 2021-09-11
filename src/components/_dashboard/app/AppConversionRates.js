import { merge } from 'lodash';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
import { getRequest } from '../../../services/request';
import { errors } from '../../../services/swal_mixin';
import { API_TOKEN } from '../../../services/config';

// ----------------------------------------------------------------------

export default function AppConversionRates() {
  const [, setNewsUs] = useState([]);
  const [, setNewsGer] = useState([]);
  const [, setNewsUk] = useState([]);
  const [, setNewsRu] = useState([]);
  const [metadataUs, setMetadataUs] = useState(null);
  const [metadataGer, setMetadataGer] = useState(null);
  const [metadataUk, setMetadataUk] = useState(null);
  const [metadataRu, setMetadataRu] = useState(null);

  const CHART_DATA = [{ data: [metadataUs, metadataGer, metadataUk, metadataRu] }];
  // const CHART_DATA = [{ data: [400, 430, 448, 470] }];
  async function NewsDataUs() {
    const response = await getRequest(`news/all?countries=us&api_token=${API_TOKEN}`);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (status !== 200) {
      return errors(error.message);
    }
    if (status === 200) {
      setNewsUs(data);
      setMetadataUs(meta?.found);
    }
  }
  async function NewsDataGer() {
    const response = await getRequest(`news/all?countries=ar&api_token=${API_TOKEN}`);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (status !== 200) {
      return errors(error.message);
    }
    if (status === 200) {
      setNewsGer(data);
      setMetadataGer(meta?.found);
    }
  }
  async function NewsDataUk() {
    const response = await getRequest(`news/all?countries=uk&api_token=${API_TOKEN}`);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (status !== 200) {
      return errors(error.message);
    }
    if (status === 200) {
      setNewsUk(data);
      setMetadataUk(meta?.found);
    }
  }
  async function NewsDataRu() {
    const response = await getRequest(`news/all?countries=ca&api_token=${API_TOKEN}`);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (status !== 200) {
      return errors(error.message);
    }
    if (status === 200) {
      setNewsRu(data);
      setMetadataRu(meta?.found);
    }
  }

  useEffect(() => {
    NewsDataUs();
    NewsDataGer();
    NewsDataUk();
    NewsDataRu();
  }, []);

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: ['United States', 'Agentina', 'United Kingdom', 'Canada']
    }
  });

  return (
    <Card>
      <CardHeader title="News By Countries" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
