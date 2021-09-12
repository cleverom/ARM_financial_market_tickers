/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
  TableContainer
} from '@material-ui/core';
// components
import Button from '@material-ui/core/Button';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/news';
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

export default function SimilarNews() {
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const similarNews = store.getState().similarType;
  console.log(similarNews);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = similarNews.map((n) => n.name);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredUsers = applySortFilter(similarNews, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Financial News | ARM News">
      <Container>
        <Link to="/dashboard/news">
          <Button variant="contained">Back</Button>
        </Link>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Similar News
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
                  rowCount={similarNews.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.map((row) => {
                    const {
                      id,
                      source,
                      title,
                      description,
                      relevance_score,
                      keywords,
                      image_url
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
                        <TableCell align="left">{keywords.substring(0, 40) || 'N/A'}</TableCell>
                      </TableRow>
                    );
                  })}
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
        </Card>
      </Container>
    </Page>
  );
}
