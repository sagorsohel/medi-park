
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSearchParams } from "react-router";

import { ShareHistoryTab } from "./components/share-history-tab";
import { CommissionSettingsTab } from "./components/commission-settings-tab";

export default function ShareManagePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultTab = searchParams.get("tab") || "history";

    const onTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    return (

        <div className="p-8">


            <div className="space-y-6">
                <Tabs defaultValue={defaultTab} onValueChange={onTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="history">Share Transfers History</TabsTrigger>
                        <TabsTrigger value="commission">Commission Settings</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <TabsContent value="history">
                            <ShareHistoryTab />
                        </TabsContent>
                        <TabsContent value="commission">
                            <CommissionSettingsTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>

    );
}
