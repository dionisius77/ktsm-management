import { Key, useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export interface IHeader {
  text: string;
  value: string;
  align?: string;
  rowStyles?: (data: any) => any;
  rowClick?: (data: any) => void;
  rowData?: (data: any) => any;
  sortable?: boolean;
}

export interface DataTableProps {
  headers: IHeader[];
  dataSource: any;
  loading?: boolean;
}

interface SkeletonProps {
  rows: number;
  columns: IHeader[];
}

interface SortColumn {
  data?: string | null;
  sorted?: boolean;
  order?: "asc" | "desc" | null;
}

interface SortIcon {
  direction: "up" | "down";
  active: boolean;
}

const DataTable = ({ headers, dataSource, loading }: DataTableProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>({
    sorted: false,
    data: null,
    order: null,
  });
  const [sortedDataSource, setSortedDataSource] = useState<any>([]);

  const handleSortColumn = (data: IHeader) => {
    setSortColumn((prev) => {
      if (prev.sorted && prev.data !== data.text) {
        return {
          ...prev,
          order: "asc",
          data: data.text,
        };
      }

      if (prev.sorted && prev.order === "asc") {
        return {
          ...prev,
          order: "desc",
        };
      }

      if (prev.sorted && prev.order === "desc") {
        return {
          sorted: false,
          data: null,
          order: null,
        };
      }

      return {
        sorted: true,
        data: data.text,
        order: "asc",
      };
    });
  };

  useEffect(() => {
    setSortedDataSource(dataSource && dataSource.length && [...dataSource]);
  }, [dataSource]);

  useEffect(() => {
    if (sortColumn.sorted) {
      const column = headers.find((header) => header.text === sortColumn.data);
      if (column) {
        setSortedDataSource((prev: any) => {
          const newData = [...prev];
          newData.sort((a: any, b: any) => {
            const aValue = a[column.value];
            const bValue = b[column.value];

            if (sortColumn.order === "asc") {
              if (aValue < bValue) return -1;
              if (aValue > bValue) return 1;
              return 0;
            } else {
              if (aValue > bValue) return -1;
              if (aValue < bValue) return 1;
              return 0;
            }
          });
          return newData;
        });
      }
    }
  }, [sortColumn]);

  return (
    <>
      {loading ? (
        <SkeletonLoader
          columns={headers}
          rows={8}
        />
      ) : (
        <table className="w-full overflow-auto">
          <thead className="bg-white border-b shadow-sm">
            <tr>
              {headers?.map((data, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-5 cursor-pointer text-${
                    data.align ?? "center"
                  }`}
                >
                  <div
                    onClick={() => data.sortable && handleSortColumn(data)}
                    className="flex items-center gap-1"
                  >
                    <span className="text-lg font-semibold text-black">
                      {data.text}
                    </span>
                    {data.sortable && (
                      <SortIcon
                        active={data.text === sortColumn.data}
                        direction={
                          data.text === sortColumn.data &&
                          sortColumn.order === "asc"
                            ? "up"
                            : "down"
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDataSource?.length > 0 ? (
              sortedDataSource?.map(
                (data: { [x: string]: any }, index: Key | null | undefined) => (
                  <tr
                    key={index}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                  >
                    {headers?.map((item, index) => (
                      <td
                        key={index}
                        className={`text-sm text-gray-900 font-light px-6 py-4`}
                      >
                        <span
                          onClick={() => item.rowClick && item.rowClick(data)}
                          className={`${
                            item.rowStyles && item.rowStyles(data)
                          }`}
                        >
                          {(item.rowData && item.rowData(data)) ||
                            data[item.value!]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ),
              )
            ) : (
              <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td
                  colSpan={100}
                  className={`text-sm text-center text-gray-900 font-light px-6 py-4`}
                >
                  <span>No data created</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

const SortIcon: React.FC<SortIcon> = (data: SortIcon): JSX.Element => {
  if (data.direction === "down") {
    return (
      <FiArrowDown
        size={20}
        color={data.active ? "red" : "black"}
      />
    );
  } else {
    return (
      <FiArrowUp
        size={20}
        color={data.active ? "red" : "black"}
      />
    );
  }
};

const SkeletonLoader: React.FC<SkeletonProps> = ({
  rows,
  columns,
}: SkeletonProps): JSX.Element => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="text-left px-4 py-5 text-lg bg-gray-200 border border-gray-300"
            >
              {column.text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((_, colIndex) => (
              <td
                key={colIndex}
                className="px-4 py-4 border border-gray-300"
              >
                <div className="w-60 h-4 bg-gray-200 animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
