import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useState } from "react";
import { headers } from "../utils/headers";
import { assetType, TableHeader } from "../utils/interfaces";
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

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<{
    key: string;
    isPercent?: boolean;
  }>({
    key: "",
  });

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
              (n: TableHeader, index: number) => (
                <TableCell
                  align="center"
                  key={index}
                  sortDirection={orderBy.key === n.key ? order : false}
                >
                  {n.key !== "symbol" && !n.hasURL ? (
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
          {sortedData.map((n, i) => (
            <TableRow
              key={props.riskParams?.indexOf(n)}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Object.entries(n)
                .filter(([key, _]) => key !== "type")
                .map(([_, value], i) => {
                  const hasURL = headers[props.protocol][i].hasURL;

                  if (hasURL) {
                    return (
                      <TableCell align="center">
                        <a href={value} target="_blank" rel="noreferrer">
                          <u>{headers[props.protocol][i].textForURL}</u>
                        </a>
                      </TableCell>
                    );
                  } else {
                    return <ColourText text={value} key={i} />;
                  }
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Datatable;
