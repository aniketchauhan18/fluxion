"use client";
// @ts-nocheck
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";



interface DataTableProps<T> {
  data: T[];
  columns: { accessorKey: string; header: string }[];
}

export default function DataTable<TData extends Record<string, any>>({
  data,
}: DataTableProps<TData>) {
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const allKeys = useMemo(() => {
    const firstRow = data[0];
    return firstRow ? Object.keys(firstRow) : [];
  }, [data]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage]);

  const handleRowClick = (row: TData) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="rounded-md border border-neutral-100 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {allKeys.map((key) => (
                <TableHead key={key}>{key}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer hover:bg-neutral-50"
                  onClick={() => handleRowClick(row)}
                >
                  {allKeys.map((key) => (
                    <TableCell key={key}>
                      <span
                        className="text-sm block max-w-[200px] truncate"
                        title={String(row[key])}
                      >
                        {String(row[key])}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allKeys.length} className="text-center py-6">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500 ml-1">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Row Details</DialogTitle>
            <DialogDescription>
              {selectedRow ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(selectedRow).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-4 py-2 font-medium text-neutral-700">
                            {key}
                          </td>
                          <td className="px-4 py-2 text-neutral-900">
                            {String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                "No details available."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
