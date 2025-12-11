"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useGetContactMessagesQuery } from "@/services/contactPageApi";
import { Loader2, Mail, Phone, User2, Calendar, MessageSquareText } from "lucide-react";

export function ContactMessages() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetContactMessagesQuery(page);

  const messages = data?.data ?? [];
  const pagination = data?.pagination;

  const showingFrom = pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 0;
  const showingTo = pagination
    ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
    : 0;

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquareText className="w-5 h-5" />
          Contact Messages
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User2 className="w-4 h-4" />
                  {msg.patient_name}
                </CardTitle>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(msg.date_of_birth).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700 px-6 py-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{msg.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{msg.phone_number}</span>
                </div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Gender: {msg.gender}</p>
                <div className="mt-2 rounded-md bg-gray-50 p-3 border border-gray-200">
                  <p className="font-semibold mb-1 text-gray-800">Message</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{msg.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.total_page > 1 && (
        <DataTablePagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_page}
          totalEntries={pagination.total_count}
          entriesPerPage={pagination.per_page}
          onPageChange={setPage}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      )}
    </div>
  );
}


