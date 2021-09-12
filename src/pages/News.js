/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/news';
import { getRequest } from '../services/request';
import { errors } from '../services/swal_mixin';
import { API_TOKEN } from '../services/config';
import Loading from '../components/loading';
import store from '../redux';

const TABLE_HEAD = [
  { id: 'source', label: 'Source', alignRight: false },
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'relevance_score', label: 'Relevance Score', alignRight: false },
  { id: 'keyword', label: 'Keyword', alignRight: false },
  { id: '' }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return (
      filter(array, (_user) => _user?.source.toLowerCase().indexOf(query.toLowerCase()) !== -1) ||
      filter(array, (_user) => _user?.title.toLowerCase().indexOf(query.toLowerCase()) !== -1) ||
      filter(
        array,
        (_user) => _user?.description.toLowerCase().indexOf(query.toLowerCase()) !== -1
      ) ||
      filter(array, (_user) => _user?.keywords.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function News() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [news, setNews] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(news, metadata);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getRequest(
        `news/all?page=${page + 1}&limit=${rowsPerPage}&language=en&api_token=${API_TOKEN}`
      );
      setLoading(false);
      const { data, meta, error } = response?.data;
      const status = response?.status;
      console.log(response, status);
      if (status !== 200) {
        return errors(error.message);
      }
      if (status === 200) {
        setNews(data);
        setMetadata(meta?.found);
      }
    })();
  }, [page, rowsPerPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = news.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - news.length) : 0;

  const filteredUsers = applySortFilter(news, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  function similarNews(news) {
    console.log(news);
    store.dispatch({
      type: 'SIMILAR',
      payload: news
    });
  }

  return (
    <>
      <Loading loading={loading} />
      <Page title="Financial News | ARM News">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Financial News
            </Typography>
          </Stack>

          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={news.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          id,
                          source,
                          title,
                          description,
                          relevance_score,
                          keywords,
                          image_url,
                          similar
                          // eslint-disable-next-line camelcase
                        } = row;
                        const isItemSelected = selected.indexOf(source) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, source)}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={source} src={image_url} />
                                <Typography variant="subtitle2" noWrap>
                                  {source}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell
                              align="left"
                              component="div"
                              fontSize="h5.fontSize"
                              height={70}
                              style={{
                                width: 'auto',
                                overflow: 'hidden',
                                whiteSpace: 'no-wrap',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {title.substring(0, 70) || 'N/A'}
                            </TableCell>
                            <TableCell
                              align="left"
                              component="div"
                              fontSize="h5.fontSize"
                              height={70}
                              style={{
                                width: 'auto',
                                overflow: 'hidden',
                                whiteSpace: 'no-wrap',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {description.substring(0, 70) || 'N/A'}
                            </TableCell>
                            <TableCell align="left">{relevance_score || 'N/A'}</TableCell>
                            <TableCell align="left">{keywords.substring(0, 40)}</TableCell>
                            <TableCell stle={{ cursor: 'pointer' }} align="left">
                              <Link to="/dashboard/similar">
                                <VisibilityIcon onClick={() => similarNews(similar)} />
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[3, 5, 10, 25]}
              component="div"
              count={metadata}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Page>
    </>
  );
}
