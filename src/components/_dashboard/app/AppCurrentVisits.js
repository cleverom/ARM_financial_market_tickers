import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
import { getRequest } from '../../../services/request';
import { errors } from '../../../services/swal_mixin';
import Loading from '../../loading';
import { API_TOKEN } from '../../../services/config';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits() {
  const theme = useTheme();
  const [newsCon, setNewsCon] = useState([]);
  const [, setNewsCom] = useState([]);
  const [, setNewsFin] = useState([]);
  const [, setNewsTek] = useState([]);
  const [metadataCon, setMetadataCon] = useState(0);
  const [metadataCom, setMetadataCom] = useState(0);
  const [metadataFin, setMetadataFin] = useState(0);
  const [metadataTek, setMetadataTek] = useState(0);
  const [loading, setLoading] = useState(false);

  // const CHART_DATA = [metadataCon];
  // const CHART_DATA = [metadataCon, metadataCon, metadataCon, metadataCon];
  const CHART_DATA = [metadataCon, metadataCom, metadataFin, metadataTek];
  // const CHART_DATA = [1, 2, 3, 4];
  async function NewsDataCon() {
    const response = await getRequest(
      `news/all?filter_entities=true&industries=Industrials&api_token=${API_TOKEN}`
    );
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (meta) {
      const { found } = meta;
      setMetadataCon(found);
    }

    if (status !== 200) {
      return errors(error?.message);
    }
    if (status === 200) {
      setNewsCon(data);
    }
  }
  async function NewsDataCom() {
    setLoading(true);
    const response = await getRequest(
      `news/all?filter_entities=true&industries=Communication Services&api_token=${API_TOKEN}`
    );
    setLoading(false);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (meta) {
      const { found } = meta;
      setMetadataCom(found);
    }

    if (status !== 200) {
      return errors(error?.message);
    }
    if (status === 200) {
      setNewsCom(data);
    }
  }
  async function NewsDataFin() {
    setLoading(true);
    const response = await getRequest(
      `news/all?filter_entities=true&industries=Financial Services&api_token=${API_TOKEN}`
    );
    setLoading(false);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (meta) {
      const { found } = meta;
      setMetadataFin(found);
    }

    if (status !== 200) {
      return errors(error?.message);
    }
    if (status === 200) {
      setNewsFin(data);
    }
  }
  async function NewsDataTek() {
    setLoading(true);
    const response = await getRequest(
      `news/all?filter_entities=true&industries=Technology&api_token=${API_TOKEN}`
    );
    setLoading(false);
    const { data, meta, error } = response?.data;
    const status = response?.status;
    if (meta) {
      const { found } = meta;
      setMetadataTek(found);
    }

    if (status !== 200) {
      return errors(error?.message);
    }
    if (status === 200) {
      setNewsTek(data);
    }
  }

  console.log(newsCon, metadataCon, metadataCom, metadataFin, metadataTek);

  useEffect(() => {
    NewsDataCon();
    NewsDataCom();
    NewsDataFin();
    NewsDataTek();
  }, []);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    labels: ['Consumer Defensive', 'Comm. Services', 'Fin Services', 'Technology'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <>
      <Loading loading={loading} />
      <Card>
        <CardHeader title="News By Top Industries" />
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart type="pie" series={CHART_DATA} options={chartOptions} height={280} />
        </ChartWrapperStyle>
      </Card>
    </>
  );
}
