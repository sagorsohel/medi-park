
import { useState } from "react";
import { Loader2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import { useGetShareTransferHistoryQuery, type ShareTransfer } from "@/services/shareManageApi";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function ShareHistoryTab() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useGetShareTransferHistoryQuery(page);

    if (isLoading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-48 items-center justify-center text-red-500">
                Failed to load share transfer history.
            </div>
        );
    }

    const transfers = data?.data || [];
    const meta = data;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {transfers.map((transfer) => (
                    <TransferCard key={transfer.id} transfer={transfer} />
                ))}
            </div>

            {meta && meta.last_page > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    if (page > 1) setPage(page - 1);
                                }}
                            />
                        </PaginationItem>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === p}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        setPage(p);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    if (page < meta.last_page) setPage(page + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

function TransferCard({ transfer }: { transfer: ShareTransfer }) {
    const [isOpen, setIsOpen] = useState(false);

    const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(transfer.created_at));
    const detailedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(transfer.created_at));

    return (
        <Card className="flex flex-col h-full  p-2">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold">
                            Transfer #{transfer.id}
                        </CardTitle>
                        <CardDescription>
                            {formattedDate}
                        </CardDescription>
                    </div>
                    <Badge variant={transfer.status === 1 ? "default" : "destructive"}>
                        {transfer.status === 1 ? "Completed" : "Pending"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <p className="text-muted-foreground">Seller</p>
                        <p className="font-medium">{transfer.seller.applicant_full_name}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Buyer</p>
                        <p className="font-medium">{transfer.buyer.applicant_full_name}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{transfer.seller.category_of_share}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{transfer.quantity}</p>
                    </div>
                </div>
                <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="text-lg font-bold">{transfer.total_amount}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Share Transfer Details #{transfer.id}</DialogTitle>
                            <DialogDescription>
                                Completed on {detailedDate}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4 border p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg border-b pb-2">Seller Information</h3>
                                    <div className="grid gap-2 text-sm">
                                        <InfoRow label="Name" value={transfer.seller.applicant_full_name} />
                                        <InfoRow label="File No" value={transfer.seller.file_number} />
                                        <InfoRow label="Father's Name" value={transfer.seller.fathers_name} />
                                        <InfoRow label="Mobile" value={transfer.seller.mobile_number} />
                                        <InfoRow label="Address" value={transfer.seller.present_address} />
                                    </div>
                                </div>
                                <div className="space-y-4 border p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg border-b pb-2">Buyer Information</h3>
                                    <div className="grid gap-2 text-sm">
                                        <InfoRow label="Name" value={transfer.buyer.applicant_full_name} />
                                        <InfoRow label="File No" value={transfer.buyer.file_number} />
                                        <InfoRow label="Father's Name" value={transfer.buyer.fathers_name} />
                                        <InfoRow label="Mobile" value={transfer.buyer.mobile_number} />
                                        <InfoRow label="Address" value={transfer.buyer.present_address} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border p-4 rounded-lg">
                                <h3 className="font-semibold text-lg border-b pb-2">Transaction Details</h3>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <InfoRow label="Category" value={transfer.seller.category_of_share} />
                                    <InfoRow label="Quantity" value={transfer.quantity} />
                                    <InfoRow label="Price per Share" value={transfer.price_per_share} />
                                    <InfoRow label="Total Amount" value={transfer.total_amount} />
                                    <InfoRow label="Status" value={transfer.status === 1 ? "Completed" : "Pending"} />
                                    <InfoRow label="Payment Mode" value={transfer.seller.mode_of_payment} />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

function InfoRow({ label, value }: { label: string; value: string | number | null }) {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-medium text-wrap wrap-break-word">{value}</span>
        </div>
    )
}
