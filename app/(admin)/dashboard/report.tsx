import React, { useState } from 'react';
import { 
    FileText, 
    Download, 
    Filter, 
    Calendar, 
    Users, 
    List, 
    ChevronDown 
} from 'lucide-react';

type ReportType = 'contacts' | 'organizations' | 'interactions' | 'growth';
type FileFormat = 'csv' | 'pdf' | 'xlsx';

const ReportsGenerator: React.FC = () => {
    const [reportType, setReportType] = useState<ReportType>('contacts');
    const [fileFormat, setFileFormat] = useState<FileFormat>('csv');
    const [filters, setFilters] = useState({
        dateRange: { start: '', end: '' },
        organizationSize: '',
        contactType: '',
    });

    const reportTypes = [
        { 
            value: 'contacts', 
            label: 'Contacts Overview', 
            description: 'Detailed breakdown of contact demographics and distribution' 
        },
        { 
            value: 'organizations', 
            label: 'Organization Insights', 
            description: 'Comprehensive analysis of organizational contacts' 
        },
        { 
            value: 'interactions', 
            label: 'Communication Logs', 
            description: 'Interaction history and communication patterns' 
        },
        { 
            value: 'growth', 
            label: 'Contact Growth', 
            description: 'Trends and growth metrics of contact base' 
        }
    ];

    const handleGenerateReport = () => {
        // Implement report generation logic
        console.log('Generating report', { reportType, fileFormat, filters });
    };

    return (
        <div className="bg-white rounded-xl p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Report Generator</h1>
                <button 
                    onClick={handleGenerateReport}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download className="mr-2 w-5 h-5" />
                    Generate Report
                </button>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reportTypes.map((type) => (
                    <div 
                        key={type.value}
                        onClick={() => setReportType(type.value as ReportType)}
                        className={`
                            border rounded-lg p-4 cursor-pointer transition-all 
                            ${reportType === type.value 
                                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }
                        `}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">{type.label}</h3>
                            {reportType === type.value && <FileText className="text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{type.description}</p>
                    </div>
                ))}
            </div>

            {/* Filters and Options */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline-block mr-2 w-4 h-4" />
                        Date Range
                    </label>
                    <div className="flex space-x-2">
                        <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={filters.dateRange.start}
                            onChange={(e) => setFilters(prev => ({
                                ...prev, 
                                dateRange: { ...prev.dateRange, start: e.target.value }
                            }))}
                        />
                        <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={filters.dateRange.end}
                            onChange={(e) => setFilters(prev => ({
                                ...prev, 
                                dateRange: { ...prev.dateRange, end: e.target.value }
                            }))}
                        />
                    </div>
                </div>

                {/* Organization Size Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="inline-block mr-2 w-4 h-4" />
                        Organization Size
                    </label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.organizationSize}
                        onChange={(e) => setFilters(prev => ({
                            ...prev, 
                            organizationSize: e.target.value
                        }))}
                    >
                        <option value="">All Sizes</option>
                        <option value="small">Small (1-50)</option>
                        <option value="medium">Medium (51-250)</option>
                        <option value="large">Large (250+)</option>
                    </select>
                </div>

                {/* Contact Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <List className="inline-block mr-2 w-4 h-4" />
                        Contact Type
                    </label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.contactType}
                        onChange={(e) => setFilters(prev => ({
                            ...prev, 
                            contactType: e.target.value
                        }))}
                    >
                        <option value="">All Types</option>
                        <option value="primary">Primary Contacts</option>
                        <option value="secondary">Secondary Contacts</option>
                        <option value="executive">Executive Level</option>
                    </select>
                </div>
            </div>

            {/* File Format Selection */}
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Export Format:</span>
                <div className="flex space-x-2">
                    {(['csv', 'pdf', 'xlsx'] as FileFormat[]).map(format => (
                        <button 
                            key={format}
                            onClick={() => setFileFormat(format)}
                            className={`
                                px-4 py-2 rounded-lg transition-all 
                                ${fileFormat === format 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                            `}
                        >
                            {format.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsGenerator;