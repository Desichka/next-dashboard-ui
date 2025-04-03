const Table = ({
                 columns,
                 data,
                 renderRow,
               }: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div
      className="my-9 overflow-scroll lg:overflow-auto text-lightTextColor dark:text-darkTextColor shadow-lg rounded-2xl bg-clip-border">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
        <tr className="h-12">
          {columns.map((column) => (
            <th key={column.accessor}
                className={`px-4 border-b bg-lightEmphasisColor dark:bg-darkEmphasisColor border-neutral-300 dark:border-neutral-600 ${column.className}`}>
              <p className="text-sm font-bold leading-none">
                {column.header}
              </p>
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {data.map(item => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;