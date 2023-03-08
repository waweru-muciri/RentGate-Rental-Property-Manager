import React from "react";
import { Link } from "react-router-dom";
import {
    Box,
    IconButton,
    Checkbox,
    Table,
    TableCell,
    TableBody,
    TableContainer,
    TablePagination,
    TableRow,
    Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DetailsIcon from "@material-ui/icons/Details";
import { withRouter } from "react-router-dom";
import EnhancedTableHead from "./EnhancedTableHead";
import useStyles from "./tableStyles";
import { stableSort, getSorting } from "./tablesSortingFunctions";

function CommonTable(props) {
    const {
        rows,
        headCells,
        selected,
        setSelected,
        deleteUrl,
        handleDelete,
        noEditCol,
        noDeleteCol,
    } = props;
    const  noDetailsCol = true;
    const { match } = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("Beds");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <Box border={1} borderRadius="borderRadius" borderColor="grey.400">
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={"medium"}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        headCells={headCells}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getSorting(order, orderBy))
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                onClick={(event) =>
                                                    handleClick(event, row.id)
                                                }
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                            />
                                        </TableCell>
                                        {headCells.map(
                                            (headCell, tableCellIndex) => {
                                                const tableCellData =
                                                    row[headCell.id];
                                                return (
                                                    <TableCell
                                                        key={tableCellIndex}
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        {typeof tableCellData ===
                                                        "boolean"
                                                            ? tableCellData
                                                                ? "Yes"
                                                                : "No"
                                                            : tableCellData}
                                                    </TableCell>
                                                );
                                            }
                                        )}
                                        {noDetailsCol ? null : (
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sortDirection={false}
                                            >
                                                <Tooltip
                                                    title="Details"
                                                    placement="bottom"
                                                >
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        component={Link}
                                                        to={`${match.url}${row.id}`}
                                                    >
                                                        <DetailsIcon fontSize="default" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        )}
                                        {noEditCol ? null : (
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sortDirection={false}
                                            >
                                                <Tooltip
                                                    title="Edit"
                                                    placement="bottom"
                                                >
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        component={Link}
                                                        to={`${match.url}/${row.id}/edit`}
                                                    >
                                                        <EditIcon fontSize="default" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        )}
                                        {noDeleteCol ? null : (
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sortDirection={false}
                                            >
                                                <Tooltip
                                                    title="Delete"
                                                    placement="bottom"
                                                >
                                                    <IconButton
                                                        onClick={(event) => {
                                                            handleDelete(
                                                                row.id,
                                                                deleteUrl
                                                            );
                                                        }}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="default" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30, 40]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Box>
    );
}

export default withRouter(CommonTable);
