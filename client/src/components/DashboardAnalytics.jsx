import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Users, Package, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const DashboardAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setData(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full p-8"><span className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></span></div>;
    }

    if (!data) return null;

    const handleExportExcel = () => {
        const dashboardData = [
            { 'หัวข้อ': 'Total Orders (30 Days)', 'จำนวน': data.totalOrders },
            { 'หัวข้อ': 'Unique Patients', 'จำนวน': data.uniquePatients },
            { 'หัวข้อ': 'Top Drugs Types', 'จำนวน': data.topDrugs.length }
        ];
        
        const topDrugsData = data.topDrugs.map(d => ({
            'ชื่อยา': d.name,
            'จำนวนที่ใช้': d.count
        }));

        const wb = XLSX.utils.book_new();
        
        const wsSummary = XLSX.utils.json_to_sheet(dashboardData);
        wsSummary['!cols'] = [{wch: 30}, {wch: 15}];
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
        
        const wsDrugs = XLSX.utils.json_to_sheet(topDrugsData);
        wsDrugs['!cols'] = [{wch: 30}, {wch: 15}];
        XLSX.utils.book_append_sheet(wb, wsDrugs, 'Top Drugs');

        XLSX.writeFile(wb, `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };
    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <Activity className="text-sky-500" size={32} />
                    Executive Analytics Dashboard
                </h1>
                <button
                    onClick={handleExportExcel}
                    className="py-2.5 px-5 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all duration-300 whitespace-nowrap bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                >
                    <Download size={18} /> Export Report (Excel)
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Orders (30 Days)</p>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{data.totalOrders}</h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Unique Patients</p>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{data.uniquePatients}</h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                        <Package size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Top Drugs Types</p>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{data.topDrugs.length}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Top 10 Drugs Usage</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topDrugs} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <RechartsTooltip 
                                    cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40}>
                                    {data.topDrugs.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Usage Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.topDrugs}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="name"
                                >
                                    {data.topDrugs.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics;
