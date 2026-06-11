import { useState } from "react";
import { Button, ListGroup, ListGroupItem, Spinner } from "flowbite-react";

export default function SearchableDropdown({ getDisplayValue, loading, label = "Select Option", required = false, error, selectedItemDisplay, setter: setSelected, results = [], searchKey, setSearchKey, disabled }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
  };

  return (
    <div className="mb-1 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{required ? `${label}*` : label}</span>
        <span className="ml-1 text-xs mb-0 text-red-400">{error}&nbsp;</span>
      </div>
      <div className="relative w-full">
        <Button disabled={disabled} onClick={() => setOpen((prev) => !prev)} className="w-full flex justify-between border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg mb-3">
          {selectedItemDisplay ? selectedItemDisplay : "Select an option"}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>

        {open && (
          <div className="absolute top-full mt-1 z-10 w-full rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-lg">
            <div className="p-2">
              <input type="text" onChange={(e) => setSearchKey(e.target.value)} placeholder="Type to Search..." className="block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg mb-3" />
              <ListGroup className="max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="text-center">
                    <Spinner aria-label="Center-aligned spinner example" />
                  </div>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <ListGroupItem key={item} onClick={() => handleSelect(item._id)} className="cursor-pointer px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                      {getDisplayValue(item)}
                    </ListGroupItem>
                  ))
                ) : (
                  <ListGroupItem disabled className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-2 text-gray-400 dark:text-gray-500">
                    <span>No results found</span>
                  </ListGroupItem>
                )}
              </ListGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
