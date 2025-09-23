'use client';

import React, { useState, useMemo } from 'react';
import StatusBadge from './statusbadge';
import ResendButton from './resendbutton';
import { WalletInvitesTableProps } from './types';
import AddInviteModal from './AddInviteModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type SortDirection = 'asc' | 'desc';
type SortableColumn = keyof WalletInvitesTableProps['data'][0];
type GroupByOption = 'trial' | 'country' | 'language'  | null;

const WalletInvitesTable: React.FC<WalletInvitesTableProps> = ({ data = [], onResend }) => {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [groupBy, setGroupBy] = useState<GroupByOption>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setGroupBy(null);
    setSearch('');
    setStartDate(null);
    setEndDate(null);
  };

  const filteredData = useMemo(() => {
    return data
      .filter((row) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          row.trial.toLowerCase().includes(searchLower) ||
          row.language.toLowerCase().includes(searchLower) ||
          row.mobile.includes(search) ||
          row.country.toLowerCase().includes(searchLower) ||
          row.cardId.toLowerCase().includes(searchLower);

        const matchesFilters = Object.entries(filters).every(([key, val]) => {
          if (!val) return true;
          return (row as any)[key]?.toString().toLowerCase() === val.toLowerCase();
        });

        // Date range filter
        let matchesDate = true;
        if (startDate || endDate) {
          const rowDate = parseDate(row.sentDate);
          if (rowDate) {
            if (startDate && rowDate < startDate) matchesDate = false;
            if (endDate && rowDate > endDate) matchesDate = false;
          } else {
            matchesDate = false;
          }
        }

        return matchesSearch && matchesFilters && matchesDate;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;

        const valA = a[sortColumn];
        const valB = b[sortColumn];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (sortColumn === 'sentDate') {
          const dateA = parseDate(valA as string)?.getTime() ?? 0;
          const dateB = parseDate(valB as string)?.getTime() ?? 0;
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, search, filters, sortColumn, sortDirection, startDate, endDate]);

  const groupedData = useMemo(() => {
    if (!groupBy) return { All: filteredData };
    return filteredData.reduce((groups: { [key: string]: typeof filteredData }, row) => {
      const key = (row as any)[groupBy] || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
      return groups;
    }, {});
  }, [filteredData, groupBy]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const renderSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) return '⬍';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Wallet Invites</h2>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center space-x-1"
            onClick={() => setShowAddModal(true)}
          >
            <span>Add</span>
            <span className="font-bold text-lg">＋</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Group */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">Group</span>
          <select
            value={groupBy || ''}
            onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
            className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="trial">Clinical Trial</option>
            <option value="country">Country/Region</option>
            <option value="language">Language</option>
          
          </select>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">Filter</span>
          {['trial', 'country', 'language', 'status'].map((key) => (
            <select
              key={key}
              value={filters[key] || ''}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {key === 'trial'
                  ? 'Clinical Trial'
                  : key === 'country'
                  ? 'Country/Region'
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
              {[...new Set(data.map((row) => (row as any)[key]).filter(Boolean))].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Date Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">Date</span>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            placeholderText="Start date"
            className="px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            placeholderText="End date"
            className="px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        {/* Clear Filters */}
        {(Object.keys(filters).length > 0 || groupBy || search || startDate || endDate) && (
          <button
            onClick={clearFilters}
            className="ml-2 px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Grouped Tables with Accordion */}
      {Object.entries(groupedData).map(([group, rows]) => (
        <div key={group} className="mb-6 border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleGroup(group)}
            className="w-full flex justify-between items-center bg-gray-100 px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-200"
          >
            <span>
              {groupBy ? `${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}: ${group}` : 'All Invites'} ({rows.length})
            </span>
            <span>{expandedGroups[group] ? '−' : '+'}</span>
          </button>

          {expandedGroups[group] && (
            <div className="overflow-x-auto border rounded shadow-md max-h-[400px] overflow-y-auto">
              <table className="w-full table-auto text-left text-sm border-collapse">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="p-3 w-6">
                      <input type="checkbox" aria-label="Select all rows" />
                    </th>
                    {[
                      { label: 'Clinical trial', key: 'trial' },
                      { label: 'Language', key: 'language' },
                      { label: 'Mobile', key: 'mobile' },
                      { label: 'Country/Region', key: 'country' },
                      
                      { label: 'Card ID', key: 'cardId' },
                      { label: 'Request ID', key: 'requestId' },
                      { label: 'Sent date', key: 'sentDate' },
                      { label: 'Status', key: 'status' },
                    ].map(({ label, key }) => (
                      <th
                        key={key}
                        className="p-3 cursor-pointer select-none font-semibold text-gray-700"
                        onClick={() => handleSort(key as SortableColumn)}
                      >
                        {label} <span>{renderSortIcon(key as SortableColumn)}</span>
                      </th>
                    ))}
                    <th className="p-3 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-6 text-gray-500">
                        No invites found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="p-3 text-center">
                          <input type="checkbox" id={`select-${row.id}`} aria-label={`Select invite ${row.id}`} className="cursor-pointer" />
                        </td>
                        <td className="p-3">{row.trial}</td>
                        <td className="p-3">{row.language}</td>
                        <td className="p-3">{row.mobile}</td>
                        <td className="p-3">{row.country}</td>
                        <td className="p-3">{row.cardId}</td>
                        <td className="p-3">{row.requestId}</td>
                        <td className="p-3">{row.sentDate ? new Date(row.sentDate).toLocaleDateString() : '-'}</td>
                        <td className="p-3">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="p-3">
                          <ResendButton status={row.status} onResend={() => onResend(row.id)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Add Invite Modal */}
      <AddInviteModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default WalletInvitesTable;
