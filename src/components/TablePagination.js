import {
    ArrowLongDownIcon,
    ArrowLongUpIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline"
import { ClockIcon } from "@heroicons/react/24/solid"
import React from "react"
import {
    useAsyncDebounce,
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table"

function TablePagination({
    columns,
    data,
    fetchData,
    loading,
    pageCount: controlledPageCount,
    totalRow,
    actions: Actions,
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter, sortBy },
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            manualPagination: true,
            manualGlobalFilter: true,
            manualSortBy: true,
            initialState: {
                pageIndex: 0,
                pageSize: 10,
            }, // Pass our hoisted table state
            pageCount: controlledPageCount,
            autoResetSortBy: false,
            autoResetExpanded: false,
            autoResetPage: false,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    )

    const GlobalFilter = ({
        preGlobalFilteredRows,
        globalFilter,
        setGlobalFilter,
    }) => {
        const count = preGlobalFilteredRows
        const [value, setValue] = React.useState(globalFilter)
        const onChange = useAsyncDebounce((value) => {
            setGlobalFilter(value || undefined)
        }, 700)

        return (
            <div
                className={
                    Actions !== undefined
                        ? "flex flex-row justify-between"
                        : "flex flex-col"
                }
            >
                {Actions !== undefined ? <Actions /> : null}
                <input
                    value={value || ""}
                    onChange={(e) => {
                        setValue(e.target.value)
                        onChange(e.target.value)
                    }}
                    placeholder={`${count} records...`}
                    type="search"
                    className={`input input-bordered input-sm w-full max-w-xs focus:outline-0 mb-2 ${
                        Actions !== undefined ? "" : "self-end"
                    }`}
                />
            </div>
        )
    }

    React.useEffect(() => {
        let search = globalFilter === undefined ? "" : globalFilter
        fetchData(pageSize, pageIndex, search, sortBy)
    }, [fetchData, pageIndex, pageSize, globalFilter, sortBy])

    return (
        <>
            <GlobalFilter
                preGlobalFilteredRows={totalRow}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            <div className="overflow-x-auto relative">
                <table
                    {...getTableProps()}
                    className="table table-compact table-zebra w-full"
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(
                                            column.getSortByToggleProps()
                                        )}
                                    >
                                        {/* <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <ArrowLongDownIcon className="h-4 w-4 inline mr-1" style={{ height: '20px', width: '20px' }}/>
                                                ) : (
                                                    <ArrowLongUpIcon className="h-4 w-4 inline mr-1" style={{ height: '20px', width: '20px' }} />
                                                )
                                            ) : (
                                                <FunnelIcon className="h-4 w-4 inline mr-1" style={{ height: '20px', width: '20px' }} />
                                            )}
                                        </span> */}
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.length > 0 ? (
                            page.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        className="hover"
                                    >
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.render("Cell")}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr className="hover">
                                <td colSpan={10000} className="text-center">
                                    Data not found!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {loading ? (
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-5 rounded-md z-20 flex items-center justify-center">
                        <div className="absolute p-3 bg-white w-36 shadow-md rounded-md text-center">
                            <div className="flex animate-pulse">
                                <ClockIcon className="w-1 h-1 mr-1" style={{ height: '20px', width: '20px' }} />{" "}
                                <span>Loading...</span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="flex flex-row justify-between">
                <div className="mt-2">
                    <span>
                    Page {" "}
                        <strong>
                            {pageIndex + 1} from {pageOptions.length}
                        </strong>{" "}
                        Total <strong>{preGlobalFilteredRows.length}</strong>{" "}
                    </span>
                    <span>
                        | Jump to Page :{" "}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0
                                gotoPage(page)
                            }}
                            className="input input-bordered input-sm w-20 max-w-xs focus:outline-0"
                        />
                    </span>{" "}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                        }}
                        className="select select-bordered select-sm w-30 max-w-xs focus:outline-0"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize} line
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-2">
                    <button
                        className="btn btn-xs"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {"<<"}
                    </button>{" "}
                    <button
                        className="btn btn-xs"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        {"<"}
                    </button>{" "}
                    <button
                        className="btn btn-xs"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        {">"}
                    </button>{" "}
                    <button
                        className="btn btn-xs"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {">>"}
                    </button>{" "}
                </div>
            </div>
        </>
    )
}

export default TablePagination