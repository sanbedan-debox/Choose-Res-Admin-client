import ReusableTable from "@/components/common/table/table";

const MenuManagement = () => {
  const headings = ["Menu"];
  const data = [{ menu: "Item 1", available: true }];

  const handleEdit = (item: { [key: string]: any }) => {
    console.log("Edit clicked", item);
  };

  const handleDelete = (item: { [key: string]: any }) => {
    console.log("Delete clicked", item);
  };

  return (
    <div className="container mx-auto p-4">
      <ReusableTable headings={headings} data={data}>
        {(item) => (
          <>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(item)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12H9m0 0v6m0-6V6"
                />
              </svg>
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(item)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </>
        )}
      </ReusableTable>
    </div>
  );
};

export default MenuManagement;
