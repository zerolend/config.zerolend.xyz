import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { headers } from "../utils/headers";
import { assetType } from "../utils/interfaces";
import { expandNumber } from "../utils/utils";

const ColourText = (props: { text: string }) => {
  const color =
    props.text == "True"
      ? "#A1DD70"
      : props.text == "False"
      ? "#f44"
      : props.text == "N/A"
      ? "#999"
      : props.text == "0%"
      ? "#999"
      : "inherit";

  return (
    <TableCell sx={{ color }} align="center">
      {props.text}
    </TableCell>
  );
};

const Datatable = (props: {
  protocol: string;
  matches: boolean;
  riskParams: assetType[] | undefined;
}) => {
  type ObjectKey = keyof typeof headers;
  let hasURL: boolean = false;

  if (props.riskParams) {
    for (let i = 0; i < props.riskParams.length; i++) {
      if (props.riskParams[i].assetLink != null) hasURL = true;
    }
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<{
    key: string;
    isPercent?: boolean;
  }>({
    key: "",
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: {
    key: string;
    isPercent?: boolean;
  }) => {
    const isAsc = orderBy.key === property.key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = props.riskParams
    ? [...props.riskParams].sort((a, b) => {
        if (orderBy) {
          const aValue = a[orderBy.key as keyof assetType];
          const bValue = b[orderBy.key as keyof assetType];
          if (aValue && bValue) {
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);

            if (isNaN(aNum) && isNaN(bNum)) {
              if (
                ["True", "False"].includes(aValue) &&
                ["True", "False"].includes(bValue)
              ) {
                const boolMap = {
                  True: 1,
                  False: 0,
                };

                return order === "asc"
                  ? boolMap[aValue as keyof typeof boolMap] -
                      boolMap[bValue as keyof typeof boolMap]
                  : boolMap[bValue as keyof typeof boolMap] -
                      boolMap[aValue as keyof typeof boolMap];
              }

              return order === "asc" ? -1 : 1;
            }

            if (orderBy.isPercent) {
              return order === "asc" ? aNum - bNum : bNum - aNum;
            }

            return order === "asc"
              ? parseFloat(expandNumber(aValue)) -
                  parseFloat(expandNumber(bValue))
              : parseFloat(expandNumber(bValue)) -
                  parseFloat(expandNumber(aValue));
          }
        }
        return 0;
      })
    : [];

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer
      sx={{
        width: props.matches ? "100%" : props.protocol === "v3" ? "90%" : "80%",
        margin: "auto",
        border: "1px dashed grey",
        size: "small",
        mt: 1,
      }}
    >
      <Table size="small" aria-label="a dense table ">
        <TableHead>
          <TableRow>
            {headers[props.protocol as ObjectKey].map(
              (
                n: { key: string; name: string; isPercent?: boolean },
                index: number
              ) => (
                <TableCell
                  align="center"
                  key={index}
                  sortDirection={orderBy.key === n.key ? order : false}
                >
                  {n.key !== "symbol" && n.key !== "assetLink" ? (
                    <TableSortLabel
                      active={orderBy.key === n.key}
                      direction={orderBy.key === n.key ? order : "asc"}
                      onClick={() =>
                        handleRequestSort({
                          key: n.key,
                          isPercent: n.isPercent,
                        })
                      }
                    >
                      <b>{n.name}</b>
                    </TableSortLabel>
                  ) : (
                    <b>{n.name}</b>
                  )}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {hasURL
            ? paginatedData.map((n) => (
                <TableRow
                  key={props.riskParams?.indexOf(n)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.keys(n).length ===
                  headers[props.protocol as ObjectKey].length
                    ? Object.values(n).map((k, index) =>
                        index === Object.keys(n).length - 1 ? (
                          ""
                        ) : (
                          <ColourText text={k} key={index} />
                        )
                      )
                    : ""}
                  <TableCell align="center">
                    <a href={n.assetLink} target="_blank" rel="noreferrer">
                      <u>more info</u>
                    </a>
                  </TableCell>
                </TableRow>
              ))
            : paginatedData.map((n) => (
                <TableRow
                  key={props.riskParams?.indexOf(n)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.keys(n).length ===
                  headers[props.protocol as ObjectKey].length
                    ? Object.values(n).map((k, index) =>
                        index === Object.keys(n).length ? (
                          ""
                        ) : (
                          <ColourText text={k} key={index} />
                        )
                      )
                    : ""}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[12, 24, 48]}
        component="div"
        count={props.riskParams ? props.riskParams.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default Datatable;
