"use client"
import React,{ useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import {
  PlusIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

type ItemColumn = {
  name: string;
  email: string;
  medium: string;
  amount: string;
  paymentStatus: string;
}


const columns: ColumnDef<ItemColumn>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-normal">{row.getValue("name")}</div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Medium",
    accessorKey: "medium",
    cell: ({ row }) => (
      <div className="font-normal">{row.getValue("medium")}</div>
    )
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <div className="font-normal">{row.getValue("amount")}</div>
    ),
  },
  {
    header: "Payment Status",
    accessorKey: "paymentStatus",
    cell: ({ row }) => (
      <div className={clsx("font-normal px-3 py-1 text-xs rounded-full w-fit", {
        "text-green-600 bg-green-100": row.getValue("paymentStatus") === "Paid",
        "text-yellow-600 bg-yellow-100": row.getValue("paymentStatus") !== "Paid",
      })}>{row.getValue("paymentStatus")}</div>
    ),
  },
];

const items: ItemColumn[] = [
  {
    name: "Gregory Reilly",
    email: "gregory.reilly@example.com",
    medium: "USDT",
    amount: "$194.52",
    paymentStatus: "Paid",
  },
  {
    name: "Eric Park",
    email: "eric.park@example.com",
    medium: "USDC",
    amount: "$133.71",
    paymentStatus: "Pending",
  },
  {
    name: "Jacqueline Graves",
    email: "jacqueline.graves@example.com",
    medium: "USDT",
    amount: "$64.62",
    paymentStatus: "Paid",
  },
  {
    name: "Jeffrey Weiss",
    email: "jeffrey.weiss@example.com",
    medium: "USDC",
    amount: "$236.32",
    paymentStatus: "Pending",
  },
  {
    name: "Robert Moore",
    email: "robert.moore@example.com",
    medium: "USDT",
    amount: "$21.08",
    paymentStatus: "Paid",
  },
  {
    name: "Samantha Martin",
    email: "samantha.martin@example.com",
    medium: "USDC",
    amount: "$76.67",
    paymentStatus: "Pending",
  },
  {
    name: "Steven Tate",
    email: "steven.tate@example.com",
    medium: "USDT",
    amount: "$474.13",
    paymentStatus: "Paid",
  },
  {
    name: "Jeremy Rivera",
    email: "jeremy.rivera@example.com",
    medium: "USDC",
    amount: "$197.41",
    paymentStatus: "Pending",
  },
  {
    name: "Stephen Terry",
    email: "stephen.terry@example.com",
    medium: "USDT",
    amount: "$397.10",
    paymentStatus: "Paid",
  },
  {
    name: "Katelyn Perez",
    email: "katelyn.perez@example.com",
    medium: "USDC",
    amount: "$166.81",
    paymentStatus: "Pending",
  },
];


interface IDashboardTable {
  tab: string | null;
  toggleAddInventoryModal: () => void;
}

export default function DashboardTable ()  {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: items,
    columns,
    initialState: {
      pagination: {
        pageSize: 7, // thala for a reason
      },
    },
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    enableSortingRemoval: false,
  });

  return (
    <div>
      <div className="space-y-6">
        <div className="px-5">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="relative h-10 border-t select-none"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-96 text-center"
                  >
                    <div className="w-full flex flex-col gap-3 justify-center items-center">
                      <img src="/folder.svg" alt="" />
                      <h4 className="font-bold text-lg">No Item Added</h4>
                      <p className="max-w-xs text-[#121217] text-sm">
                        Please add a document to get started and manage your
                        operations efficiently.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          className="bg-[#7047EB] h-8 text-sm hover:bg-[#7047EB] shadow-none text-white rounded-md px-4 py-2"
                        >
                          <PlusIcon className="" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      </div>
    </div>
  );
};
