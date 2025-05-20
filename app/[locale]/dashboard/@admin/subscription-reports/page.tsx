import { Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SubscriptionReportsPage({organisationDetails}: any) {
    const monthlyTotal = 299.99

    return (
        <div className="container mx-auto p-6">
            <Card className="shadow-lg border-blue-100">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-2xl font-bold text-blue-900">
                        Billing History
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                        View and download your billing history
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[
                            { date: "Nov 1, 2023", amount: monthlyTotal },
                            { date: "Oct 1, 2023", amount: monthlyTotal },
                            { date: "Sep 1, 2023", amount: monthlyTotal },
                        ].map((invoice, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-4 px-4 border-b border-blue-100 last:border-0 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                <div>
                                    <p className="font-semibold text-blue-900">{invoice.date}</p>
                                    <p className="text-sm text-blue-600">
                                        ${invoice.amount.toFixed(2)}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}