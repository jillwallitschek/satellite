import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { DateLike, formatDate } from "../utils/date";

type Order = "asc" | "desc";

type RowId = number | string;

type CellDataType = "string" | "date" | "number" | "reactNode";

export type HeaderCell<T extends string> = {
  id: T;
  label: string;
  columnHint?: string;
  dataType: CellDataType;
};

type RowCell = string | number | React.ReactNode | undefined | Date;

type CustomRow<T extends string> = Record<T, RowCell>;

export type IndexedCustomRow<T extends string> = CustomRow<T> & {
  rowId: RowId;
};

type TableHeaderProps<T extends string> = {
  headerCells: HeaderCell<T>[];
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof CustomRow<T>,
  ) => void;
  order: Order;
  orderBy: T | undefined;
  rowCount: number;
};

type FilterTableProps<T extends string> = {
  rows: IndexedCustomRow<T>[];
  headerCells: Array<HeaderCell<T> & { id: T }>;
  defaultOrder: keyof CustomRow<T> | undefined;
  defaultOrderDirection: Order | undefined;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof CustomRow<T>, T extends string>(
  order: Order,
  orderBy: Key,
): (a: IndexedCustomRow<T>, b: IndexedCustomRow<T>) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Toolbar sx={{ flexGrow: "100" }}>
      <TextField
        label={
          <span style={{ display: "flex", alignItems: "flex-start" }}>
            <Search /> Search...
          </span>
        }
        margin="normal"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const query = event.target.value?.toString().toLowerCase() ?? "";
          onChange(query);
        }}
        style={{ width: "220px" }}
        value={value}
        variant="standard"
      />
    </Toolbar>
  );
}

function CustomTableHeader<T extends string>(props: TableHeaderProps<T>) {
  const { headerCells, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof CustomRow<T>) => {
    return (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  };
  return (
    <TableHead>
      <TableRow>
        {headerCells.map((cell) => {
          const disableSort = Boolean(cell.dataType === "reactNode");
          return (
            <TableCell
              align="left"
              key={cell.id}
              sortDirection={orderBy === cell.id ? order : false}
              sx={{
                fontWeight: 500,
              }}
            >
              <Tooltip title={cell.columnHint || ""}>
                {disableSort ? (
                  <span>{cell.label}</span>
                ) : (
                  <TableSortLabel
                    active={orderBy === cell.id}
                    direction={orderBy === cell.id ? order : "asc"}
                    onClick={createSortHandler(cell.id)}
                  >
                    {cell.label}
                    {orderBy === cell.id ? (
                      <Box component="span" sx={{ display: "none" }}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                )}
              </Tooltip>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

/**
 * A table with pagination that allows you to search or sort columns
 *
 * @param props
 * @returns React Table
 */
export default function CustomTable<T extends string>(
  props: FilterTableProps<T>,
) {
  const { headerCells, rows, defaultOrderDirection, defaultOrder } = props;
  const defaultRowsPerPageOptions = [5, 10, 25, 50, 100];
  const defaultRowsPerPage = 5;

  const [order, setOrder] = React.useState<Order>(
    defaultOrderDirection || "asc",
  );
  const [orderBy, setOrderBy] = React.useState<keyof CustomRow<T> | undefined>(
    defaultOrder,
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof CustomRow<T>,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value) ?? defaultRowsPerPage);
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = React.useMemo(() => {
    if (!searchQuery) return rows;
    const searchableHeaderCells = headerCells.filter(
      (cell) => cell.dataType !== "reactNode",
    );
    return rows.filter((row) =>
      searchableHeaderCells.some((cell) => {
        const value = row[cell.id];
        if (cell.dataType === "date") {
          const formatted = formatDate(value as DateLike)?.toLowerCase() ?? "";
          return formatted.includes(searchQuery);
        }
        return String(value).toLowerCase().includes(searchQuery);
      }),
    );
  }, [searchQuery, headerCells, rows]);

  const visibleRows = React.useMemo(() => {
    const sortedRows = orderBy
      ? [...filteredRows].sort(getComparator(order, orderBy))
      : filteredRows;
    const slicedRows = sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    return slicedRows;
  }, [order, orderBy, page, rowsPerPage, filteredRows]);
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ display: "flex", alignItems: "flex-end", marginBottom: "1rem" }}
      >
        <SearchBar
          onChange={(query) => {
            setSearchQuery(query);
            setPage(0);
          }}
          value={searchQuery}
        />
      </Box>
      <TableContainer
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": { width: "8px", height: "8px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#a8a8a8" },
        }}
      >
        <Table aria-labelledby="tableTitle" size={"medium"}>
          <CustomTableHeader
            {...props}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
            rowCount={rows.length}
          />
          <TableBody>
            {visibleRows.map((row) => {
              return (
                <TableRow hover={false} key={row.rowId} tabIndex={-1}>
                  {headerCells.map((cell) => {
                    const rowValue = row[cell.id];
                    return (
                      <TableCell align="left" key={cell.id}>
                        {rowValue === null || rowValue === undefined ? (
                          "-"
                        ) : cell.dataType === "reactNode" ? (
                          <>{rowValue as React.ReactNode}</>
                        ) : cell.dataType === "date" ? (
                          <>{formatDate(rowValue as DateLike)}</>
                        ) : (
                          String(rowValue)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
            {!rows.length && (
              <TableRow>
                <TableCell>Oops! Looks like there's no data yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRows.length}
        onPageChange={(_, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={defaultRowsPerPageOptions}
      />
    </Box>
  );
}
