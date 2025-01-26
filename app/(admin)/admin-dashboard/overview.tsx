import React from 'react';
import { 
    Users, 
    Mail, 
    Phone, 
    TrendingUp, 
    TrendingDown, 
    Activity, 
    ShieldCheck, 
    CreditCard, 
    FileText, 
    Database, 
    Layers, 
    Sliders, 
    Menu 
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const subscriptionData = [
    { name: 'Jan', subscribers: 450, revenue: 1500 },
    { name: 'Feb', subscribers: 520, revenue: 1700 },
    { name: 'Mar', subscribers: 620, revenue: 2000 },
    { name: 'Apr', subscribers: 580, revenue: 1800 },
    { name: 'May', subscribers: 680, revenue: 2200 },
    { name: 'Jun', subscribers: 750, revenue: 2500 }
];

const upcomingExpirations = [
    { name: 'John Doe', subscriptionDate: '2023-07-10' },
    { name: 'Jane Doe', subscriptionDate: '2023-08-15' },
    { name: 'Bob Smith', subscriptionDate: '2023-09-20' }
];

interface MetricCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change: number;
    positive: boolean;
}

const MetricCard = ({ icon, title, value, change, positive }: MetricCardProps) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                {icon}
            </div>
            <div className="flex items-center text-sm">
                {positive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={positive ? 'text-green-600' : 'text-red-600'}>
                    {change}%
                </span>
            </div>
        </div>
        <div>
            <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Overview = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Overview</h1>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard 
                    icon={<Users />}
                    title="Total Subscribers"
                    value="3,245"
                    change={12.5}
                    positive={true}
                />
                <MetricCard 
                    icon={<Mail />}
                    title="Email Subscribers"
                    value="2,103"
                    change={8.2}
                    positive={true}
                />
                <MetricCard 
                    icon={<Phone />}
                    title="Phone Subscribers"
                    value="1,142"
                    change={-3.5}
                    positive={false}
                />
                <MetricCard 
                    icon={<Activity />}
                    title="Active Organizations"
                    value="87"
                    change={15.7}
                    positive={true}
                />
            </div>

            {/* Subscription Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription Revenue</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={subscriptionData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3B82F6" 
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Upcoming Expirations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Expirations</h2>
                <ul>
                    {upcomingExpirations.map((expiration) => (
                        <li key={expiration.name}>
                            <div className="flex items-center mb-2">
                                <span className="text-gray-500 mr-2">{expiration.name}</span>
                                <span className="text-red-500">{expiration.subscriptionDate}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Support</h2>
                <ul>
                    <li>
                        <div className="flex items-center mb-2">
                            <ShieldCheck className="text-green-500 mr-2" />
                            <span>General Support</span>
                        </div>
                    </li>
                    
                </ul>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h2>
                <ul>
                    <li>
                        <div className="flex items-center mb-2">
                            <CreditCard className="text-blue-500 mr-2" />
                            <span>Credit Card</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center mb-2">
                            <FileText className="text-gray-500 mr-2" />
                            <span>Bank Transfer</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Database */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Database</h2>
                <ul>
                    <li>
                        <div className="flex items-center mb-2">
                            <Database className="text-blue-500 mr-2" />
                            <span>MongoDB</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Layers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Layers</h2>
                <ul>
                    <li>
                        <div className="flex items-center mb-2">
                            <Layers className="text-gray-500 mr-2" />
                            <span>Layer 1</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center mb-2">
                            <Layers className="text-gray-500 mr-2" />
                            <span>Layer 2</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Sliders */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sliders</h2>
                <ul>
                    <li>
                        <div className="flex items-center mb-2">
                            <Sliders className="text-gray-500 mr-2" />
                            <span>Slider 1</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center mb-2">
                            <Sliders className="text-gray-500 mr-2" />
                            <span>Slider 2</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>
                <ul>
                    <li>
                        <div className="flex items-center mb-2">
                            <Menu className="text-gray-500 mr-2" />
                            <span>Main Menu</span>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
    );
};

export default Overview;